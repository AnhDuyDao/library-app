import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import BookModel from "../../models/BookModel";
import { SpinnerLoading } from "../Utils/SpinnerLoading";

export const ReadBookPage = () => {

   const { bookId } = useParams<{ bookId: string }>();
   const [book, setBook] = useState<{ title: string, pdfUrl: string } | null>(null);
   const [isLoading, setIsLoading] = useState(true);

   useEffect(() => {
      const fetchBook = async () => {
         const response = await fetch(`${process.env.REACT_APP_API}/books/${bookId}`);
         if (!response.ok) {
            throw new Error('Something went wrong!');
         }
         const responseJson = await response.json();
         setBook({ title: responseJson.title, pdfUrl: responseJson.pdfUrl });
         setIsLoading(false);
      };
      fetchBook().catch(() => setIsLoading(false));
   }, [bookId]);

   if (isLoading) {
      return (
         <SpinnerLoading />
      )
   }

   if (!book) return <p>Book not found</p>;
   return (
      <div className="container mt-4">
         <h2>{book.title}</h2>
         {book?.pdfUrl ?
            <>
               <iframe
                  src={`${book.pdfUrl}#navpanes=0&scrollbar=0`}
                  width="100%"
                  height="600px"
                  style={{ border: "none" }}
               />
            </>
            :
            <p>There is no book</p>
         }
      </div>
   );
}