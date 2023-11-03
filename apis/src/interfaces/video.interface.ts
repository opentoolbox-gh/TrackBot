export default interface Video {
    url: string,
    thumbnail: string,
    title: string,
    status: string,
    watchedBy?: string[],
    date?: Date;
}
