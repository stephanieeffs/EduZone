import java.util.ArrayList;
import java.util.List;

public class SchoolLibrary {
    private List<Book> books;

    public SchoolLibrary() {
        this.books = new ArrayList<>();
    }

    public void addNewBook(Book book) {
        books.add(book);
        System.out.println("Book added: " + book.getTitle());
    }

    public boolean removeBook(String title) {
        return books.removeIf(book -> book.getTitle().equalsIgnoreCase(title));
    }
}
