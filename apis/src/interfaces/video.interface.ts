export default interface Video {
    url: String,
    thumbnail: String,
    title: String,
    status: String,
    watchedBy?: [String],
    date?: Date;
}