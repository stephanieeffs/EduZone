public class LibrarianUser extends User {

    public LibrarianUser(String name, String id, String password) {
        super(name, id, password);
    }

    public void addNewBook(Book book, SchoolLibrary library) {
        library.addBook(book);
    }

    public void removeBook(String title, SchoolLibrary library) {
        library.removeBook(title);
    }

    public void removeBook(String title) {
        new SchoolLibrary().removeBook(title);
    }
}
