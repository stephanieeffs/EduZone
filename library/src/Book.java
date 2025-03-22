public class Book{
    private String title;
    private String author;
    private String status;
    private String id;

    public Book(String id, String title, String author, String status){
        this.id = id;
        this.title = title;
        this.author = author;
        this.status = status;
    }

    public String getAuthor(){
        return author;
    }

    public String getTitle(){
        return title;
    }

    public String getStatus(){
        return status;
    }

    public String getId(){
        return id;
    }

    public void setStatus(String status){
        this.status = status;
    }

    public boolean isAvailable(){
        return "Available".equalsIgnoreCase(this.status);
    }
}