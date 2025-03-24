public class Book {
    private String title;
    private String author;
    private String status;
    private int gradeLevel;        // new
    private String coverImageUrl;  // new

    public Book(String title, String author, String status, 
                int gradeLevel, String coverImageUrl) {
        this.title = title;
        this.author = author;
        this.status = status;
        this.gradeLevel = gradeLevel;
        this.coverImageUrl = coverImageUrl;
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

    public void setStatus(String status){
        this.status = status;
    }

    public boolean isAvailable(){
        return "Available".equalsIgnoreCase(this.status);
    }

    public int getGradeLevel() { 
        return gradeLevel; 
    }

    public void setGradeLevel(int gradeLevel) { 
        this.gradeLevel = gradeLevel; 
    }

    public String getCoverImageUrl() { 
        return coverImageUrl; 
    }

    public void setCoverImageUrl(String coverImageUrl) { 
        this.coverImageUrl = coverImageUrl; 
    }

}