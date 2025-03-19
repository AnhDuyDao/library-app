package com.duyanh.spring_boot_library.controller;

import com.duyanh.spring_boot_library.requestmodels.AddBookRequest;
import com.duyanh.spring_boot_library.service.AdminService;
import com.duyanh.spring_boot_library.service.CloudinaryService;
import com.duyanh.spring_boot_library.utils.ExtractJWT;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin("http://localhost:3000")
@RestController
@RequestMapping("/api/admin")
public class AdminController {
    private AdminService adminService;
    private CloudinaryService cloudinaryService;

    public AdminController(AdminService adminService, CloudinaryService cloudinaryService) {
        this.adminService = adminService;
        this.cloudinaryService = cloudinaryService;
    }

    @PutMapping("/secure/increase/book/quantity")
    public void increaseBookQuantity(@RequestHeader(value = "Authorization") String token,
                                     @RequestParam Long bookId) throws Exception {
        String admin = ExtractJWT.payloadJWTExtraction(token,"userType");
        if (admin == null || !admin.equals("admin")) {
            throw new Exception("Administration page only");
        }
        adminService.increaseBookQuantity(bookId);
    }

    @PutMapping("/secure/decrease/book/quantity")
    public void decreaseBookQuantity(@RequestHeader(value = "Authorization") String token,
                                     @RequestParam Long bookId) throws Exception {
        String admin = ExtractJWT.payloadJWTExtraction(token, "userType");
        if (admin == null || !admin.equals("admin")) {
            throw new Exception("Administration page only");
        }
        adminService.decreaseBookQuantity(bookId);
    }

    @PostMapping("/secure/add/book")
    public void postBook(@RequestHeader(value = "Authorization") String token,
                         @RequestBody AddBookRequest addBookRequest) throws Exception {
        String admin = ExtractJWT.payloadJWTExtraction(token, "userType");
        if (admin == null || !admin.equals("admin")) {
            throw new Exception("Administration page only");
        }
        if (addBookRequest.getPdfUrl() == null || addBookRequest.getPdfUrl().isEmpty()){
            throw new Exception("PDF is missing");
        }
        adminService.postBook(addBookRequest);
    }

    @DeleteMapping("/secure/delete/book")
    public void deleteBook(@RequestHeader(value = "Authorization") String token,
                           @RequestParam Long bookId) throws Exception {
        String admin = ExtractJWT.payloadJWTExtraction(token, "userType");
        if (admin == null || !admin.equals("admin")) {
            throw new Exception("Administration page only");
        }
        adminService.deleteBook(bookId);
    }

    @GetMapping("/secure/generate-presigned-url")
    public Map<String, Object> generatePresignedUrl(@RequestHeader(value = "Authorization") String token,
                                                    @RequestParam String publicId) throws Exception {
        String admin = ExtractJWT.payloadJWTExtraction(token, "userType");
        if (admin == null || !admin.equals("admin")) {
            throw new Exception("Administration page only");
        }
        return cloudinaryService.generatePresignedUrl(publicId);
    }
}
