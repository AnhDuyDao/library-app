package com.duyanh.spring_boot_library.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class CloudinaryService {
    private final Cloudinary cloudinary;

    public CloudinaryService(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    public Map<String, Object> generatePresignedUrl(String publicId) throws Exception {
        Map<String, Object> options = ObjectUtils.asMap(
            "public_id", publicId,
                "timestamp", System.currentTimeMillis() / 1000
        );
        String signature = cloudinary.apiSignRequest(options, cloudinary.config.apiSecret);
        String uploadUrl = "https://api.cloudinary.com/v1_1/" + cloudinary.config.cloudName + "/raw/upload";
        return Map.of(
                "uploadUrl", uploadUrl,
                "timestamp", options.get("timestamp"),
                "signature", signature,
                "api_key", cloudinary.config.apiKey,
                "public_id", publicId
        );
    }
}
