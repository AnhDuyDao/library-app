class AddBookRequest {
   title: string;
   author: string;
   description: string;
   copies: number;
   category: string;
   img?: string;
   pdfUrl?: string;

   constructor(tile: string, author: string, description: string,
      copies: number, category: string) {
      this.title = tile;
      this.author = author;
      this.description = description;
      this.copies = copies;
      this.category = category;
   }
}

export default AddBookRequest;