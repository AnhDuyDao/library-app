import { useOktaAuth } from "@okta/okta-react";
import { useRef, useState } from "react";
import AddBookRequest from "../../../models/AddBookRequest";
import { v4 as uuidv4 } from "uuid";
import { Field } from "@okta/okta-signin-widget";
export const AddNewBook = () => {
   const { authState } = useOktaAuth();

   const [title, setTitle] = useState('');
   const [author, setAuthor] = useState('');
   const [description, setDescription] = useState('');
   const [copies, setCopies] = useState(0);
   const [category, setCategory] = useState("Category");
   const [selectedImage, setSelectedImage] = useState<any>(null);
   const [selectedPdf, setSelectedPdf] = useState<File | null>(null);
   const [pdfError, setPdfError] = useState<string | null>(null);

   const [displayWarning, setDisplayWarning] = useState(false);
   const [displaySuccess, setDisplaySuccess] = useState(false);
   const [isUploading, setIsUploading] = useState(false);

   const fileInputRefPdf = useRef<HTMLInputElement>(null);
   const fileInputRefImg = useRef<HTMLInputElement>(null);

   function categoryField(value: string) {
      setCategory(value);
   }

   async function base64ConversionForImages(e: any) {
      if (e.target.files[0]) {
         getBase64(e.target.files[0]);
      }
   }

   function getBase64(file: any) {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function () {
         setSelectedImage(reader.result);
      };
      reader.onerror = function (error) {
         console.log('Error: ', error);
      }
   }

   function handlePdfUpload(e: any) {
      const file = e.target.files[0];
      setPdfError(null);

      // Reset if no file selected
      if (!file) {
         setSelectedPdf(null);
         return;
      }

      // Validate file type
      if (file.type !== 'application/pdf') {
         setPdfError('Only PDF files are allowed');
         return;
      }

      // Validate file size (limit to 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB in bytes
      if (file.size > maxSize) {
         setPdfError(`File size exceeds 10MB limit (${(file.size / (1024 * 1024)).toFixed(2)}MB)`);
         return;
      }

      setSelectedPdf(file);
   }

   const getPresignedUrl = async (publicId: string) => {
      try {
         const url = `${process.env.REACT_APP_API}/admin/secure/generate-presigned-url?publicId=${publicId}`;
         const requestOptions = {
            method: 'GET',
            headers: {
               Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
            },
         };
         const response = await fetch(url, requestOptions);
         if (!response.ok) {
            throw new Error("Failed to get presigned URL");
         }

         return await response.json();
      } catch (error) {
         console.error("Error getting presigned URL:", error);
         throw error;
      }
   }

   const uploadPdfToCloudinary = async (file: File, presignedData: any): Promise<string> => {
      try {
         const formData = new FormData();
         formData.append('file', file);
         formData.append("resource_type", "raw");
         formData.append('public_id', presignedData.public_id);
         formData.append('api_key', presignedData.api_key);
         formData.append('timestamp', presignedData.timestamp);
         formData.append('signature', presignedData.signature);

         const response = await fetch(presignedData.uploadUrl, {
            method: 'POST',
            body: formData,
         });

         if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Failed to upload PDF: ${errorData.error?.message || 'Unknown error'}`);
         }

         const data = await response.json();
         return data.secure_url;
      } catch (error) {
         console.error('PDF upload error:', error);
         throw error;
      }
   };

   async function submitNewBook() {
      try {

         setDisplayWarning(false);
         setDisplaySuccess(false);
         setPdfError(null);

         const url = `${process.env.REACT_APP_API}/admin/secure/add/book`;


         if (!(authState?.isAuthenticated && title !== "" && author !== "" &&
            description !== "" && category !== "Category" && copies >= 0)) {
            setDisplayWarning(true);
            return;
         }


         if (!selectedPdf) {
            setPdfError("Please select a PDF file");
            return;
         }
         setIsUploading(true);

         let presignedData;
         try {
            const uniqueId = uuidv4();
            const publicId = `books/${uniqueId}`;
            presignedData = await getPresignedUrl(publicId);
         } catch (error) {
            setPdfError(`Failed to get presigned URL: ${error instanceof Error ? error.message : 'Unknown error'}`);
            setIsUploading(false);
            return;
         }

         // Upload PDF to Cloudinary
         let pdfUrl;
         try {
            pdfUrl = await uploadPdfToCloudinary(selectedPdf, presignedData);
         } catch (error) {
            setPdfError(`Failed to upload PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
            setIsUploading(false);
            return;
         }

         // Create book request
         const book: AddBookRequest = new AddBookRequest(title, author, description, copies, category);
         book.img = selectedImage;
         book.pdfUrl = pdfUrl;

         // Send to backend
         const requestOptions = {
            method: "POST",
            headers: {
               Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
               'Content-Type': 'application/json'
            },
            body: JSON.stringify(book)
         };

         const submitNewBookResponse = await fetch(url, requestOptions);
         if (!submitNewBookResponse.ok) {
            const errorData = await submitNewBookResponse.json().catch(() => ({}));
            throw new Error(errorData.message || "Failed to add book");
         }

         // Reset form on success
         setTitle('');
         setAuthor('');
         setDescription('');
         setCopies(0);
         setCategory('Category');
         setSelectedImage(null);
         if (fileInputRefImg.current) {
            fileInputRefImg.current.value = "";
         }
         setSelectedPdf(null);
         if (fileInputRefPdf.current) {
            fileInputRefPdf.current.value = "";
         }
         setDisplaySuccess(true);
      } catch (error) {
         console.error("Error adding book:", error);
         setDisplayWarning(true);
      } finally {
         setIsUploading(false);
      }
   }

   return (
      <div className="container mt-5 mb-5">
         {displaySuccess &&
            <div className="alert alert-success" role="alert">
               Book added successfully!
            </div>
         }
         {displayWarning &&
            <div className="alert alert-danger" role="alert">
               All fields must be filled out.
            </div>
         }
         {pdfError &&
            <div className="alert alert-danger" role="alert">
               PDF Error: {pdfError}
            </div>
         }
         <div className="card">
            <div className="card-header">
               Add a new book
            </div>
            <div className="card-body">
               <form method="POST">
                  <div className="row">
                     <div className="col-md-6 mb-3">
                        <label className="form-label">Title</label>
                        <input type="text" className="form-control" name="title" required
                           onChange={e => setTitle(e.target.value)} value={title} />
                     </div>
                     <div className="col-md-3 mb-3">
                        <label className="form-label">Author</label>
                        <input type="text" className="form-control" name="author" required
                           onChange={e => setAuthor(e.target.value)} value={author} />
                     </div>
                     <div className="col-md-3 mb-3">
                        <label className="form-label">Category</label>
                        <button className="form-control btn btn-secondary dropdown-toggle" type="button"
                           id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                           {category}
                        </button>
                        <ul id="addNewBookId" className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                           <li><a onClick={() => categoryField("FE")} className="dropdown-item">Front End</a></li>
                           <li><a onClick={() => categoryField("BE")} className="dropdown-item">Back End</a></li>
                           <li><a onClick={() => categoryField("Data")} className="dropdown-item">Data</a></li>
                           <li><a onClick={() => categoryField("DevOps")} className="dropdown-item">DevOps</a></li>
                        </ul>
                     </div>
                  </div>
                  <div className="col-md-12 mb-3">
                     <label className="form-label">Desciption</label>
                     <textarea className="form-control" id="exampleFormControlTextarea1"
                        rows={3} onChange={e => setDescription(e.target.value)} value={description}></textarea>
                  </div>
                  <div className="col-md-3 mb-3">
                     <label className="form-label">Copies</label>
                     <input type="number" className="form-control" name="Copies" required
                        onChange={e => setCopies(Number(e.target.value))} value={copies} />
                  </div>

                  <div className="col-md-3 mb-3">
                     <label className="form-label fw-bold">Upload Book Cover Image</label>
                     <input ref={fileInputRefImg} type="file" onChange={e => base64ConversionForImages(e)} />
                  </div>

                  <div className="col-md-3 mb-3">
                     <label className="form-label fw-bold">Upload PDF File</label>
                     <input ref={fileInputRefPdf} type="file" accept="application/pdf" onChange={e => handlePdfUpload(e)} />
                  </div>
                  <div>
                     <button
                        type="button"
                        className="btn btn-primary mt-3"
                        onClick={submitNewBook}
                        disabled={isUploading}
                     >
                        {isUploading ? 'Uploading...' : 'Add Book'}
                     </button>
                     {selectedPdf && !pdfError && (
                        <span className="ms-3 text-success">
                           Selected: {selectedPdf.name} ({(selectedPdf.size / (1024 * 1024)).toFixed(2)}MB)
                        </span>
                     )}
                  </div>
               </form>
            </div>
         </div>
      </div>
   );
}
