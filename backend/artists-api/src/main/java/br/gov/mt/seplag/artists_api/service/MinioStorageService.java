package br.gov.mt.seplag.artists_api.service;

import io.minio.*;
import io.minio.http.Method;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.concurrent.TimeUnit;

@Service
public class MinioStorageService {

    private final MinioClient minioClientInternal;
    private final MinioClient minioClientPublic;
    private final String bucket;
    private final String internalUrl;
    private final String publicUrl;

    public MinioStorageService(
            @Value("${minio.bucket}") String bucket,
            @Value("${minio.url}") String minioInternalUrl,
            @Value("${minio.public-url}") String minioPublicUrl,
            @Value("${minio.access-key}") String accessKey,
            @Value("${minio.secret-key}") String secretKey
    ) {
        this.bucket = bucket;
        this.internalUrl = trim(minioInternalUrl);
        this.publicUrl = trim(minioPublicUrl);

        this.minioClientInternal = MinioClient.builder()
                .endpoint(this.internalUrl)
                .credentials(accessKey, secretKey)
                .region("us-east-1")
                .build();

        this.minioClientPublic = MinioClient.builder()
                .endpoint(this.publicUrl)
                .credentials(accessKey, secretKey)
                .region("us-east-1")
                .build();

        System.out.println("[MINIO] internal=" + this.internalUrl + " public=" + this.publicUrl + " bucket=" + bucket);
    }

    private String trim(String s) {
        if (s == null) return null;
        return s.endsWith("/") ? s.substring(0, s.length() - 1) : s;
    }

    @PostConstruct
    void initBucket() throws Exception {
        boolean exists = minioClientInternal.bucketExists(BucketExistsArgs.builder().bucket(bucket).build());
        if (!exists) minioClientInternal.makeBucket(MakeBucketArgs.builder().bucket(bucket).build());
    }

    public String upload(MultipartFile file, String folder) throws Exception {
        String extension = getExtension(file.getOriginalFilename());
        String objectName = folder + "/" + java.util.UUID.randomUUID() + extension;

        minioClientInternal.putObject(
                PutObjectArgs.builder()
                        .bucket(bucket)
                        .object(objectName)
                        .stream(file.getInputStream(), file.getSize(), -1)
                        .contentType(file.getContentType())
                        .build()
        );

        return objectName;
    }

    private String getExtension(String filename) {
        if (filename == null || !filename.contains(".")) return "";
        return filename.substring(filename.lastIndexOf("."));
    }

    public String generatePresignedUrl(String objectName) throws Exception {
        String url = minioClientPublic.getPresignedObjectUrl(
                GetPresignedObjectUrlArgs.builder()
                        .bucket(bucket)
                        .object(objectName)
                        .method(Method.GET)
                        .expiry(30, TimeUnit.MINUTES)
                        .build()
        );

        System.out.println("[MINIO] presigned=" + url);
        return url;
    }

    public void delete(String objectPath) {
        try {
            minioClientInternal.removeObject(
                    RemoveObjectArgs.builder().bucket(bucket).object(objectPath).build()
            );
        } catch (Exception e) {
            throw new RuntimeException("Erro ao remover arquivo do MinIO", e);
        }
    }
}

