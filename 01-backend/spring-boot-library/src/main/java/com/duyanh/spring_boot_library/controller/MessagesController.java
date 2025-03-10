package com.duyanh.spring_boot_library.controller;

import com.duyanh.spring_boot_library.entity.Message;
import com.duyanh.spring_boot_library.requestmodels.AdminQuestionRequest;
import com.duyanh.spring_boot_library.service.MessagesService;
import com.duyanh.spring_boot_library.utils.ExtractJWT;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("https://localhost:3000")
@RestController
@RequestMapping("/api/messages")
public class MessagesController {
    private MessagesService messagesService;

    public MessagesController(MessagesService messagesService) {
        this.messagesService = messagesService;
    }

    @PostMapping("/secure/add/message")
    public void postMessage(@RequestHeader(value = "Authorization") String token,
                            @RequestBody Message messageRequest) {
        String userEmail = ExtractJWT.payloadJWTExtraction(token, "sub");
        messagesService.postMessage(messageRequest, userEmail);
    }

    @PutMapping("/secure/admin/message")
    public void putMessage(@RequestHeader(value = "Authorization") String token,
                           @RequestBody AdminQuestionRequest adminQuestionRequest) throws Exception {
        String userEmail = ExtractJWT.payloadJWTExtraction(token, "sub");
        String admin = ExtractJWT.payloadJWTExtraction(token, "userType");
        if (admin == null || !admin.equals("admin")) {
            throw new Exception("Adminstration page only.");
        }
        messagesService.putMessage(adminQuestionRequest, userEmail);
    }
}
