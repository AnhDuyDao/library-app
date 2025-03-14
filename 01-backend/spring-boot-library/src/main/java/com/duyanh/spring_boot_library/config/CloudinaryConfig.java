package com.duyanh.spring_boot_library.config;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.stripe.model.tax.Registration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CloudinaryConfig {
    @Bean
    public Cloudinary cloudinary() {
        return new Cloudinary(ObjectUtils.asMap(
                "cloud_name", EnvConfig.get("CLOUDINARY_CLOUD_NAME"),
                "api_key",EnvConfig.get("CLOUDINARY_API_KEY"),
                "api_secret", EnvConfig.get("CLOUDINARY_API_SECRET")
        ));
    }
}
