class ReviewRequestModel {
    rating: number;
    bookId: number;
    reviewDescription?: string; //optional

    constructor(rating: number, bookId: number, reviewDescription?: string) {
        this.rating = rating;
        this.bookId = bookId;
        this.reviewDescription = reviewDescription;
    }
}

export default ReviewRequestModel;