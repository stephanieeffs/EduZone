import java.sql.*;

public class DatabaseTest {
    public static void main(String[] args) {
        Book newBook = new Book("B004", "Clean Code", "Robert C. Martin", "Available");
        SchoolLibrary library = new SchoolLibrary();
        library.addBook(newBook);
        Book newBook2 = new Book("B003","Dragon Ball Super Volume 24","Akira Toriyama","Available");
        library.addBook(newBook2);
        library.removeBook("Clean Code");
    }
}
