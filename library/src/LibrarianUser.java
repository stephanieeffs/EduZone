public class LibrarianUser extends User{
    public LibrarianUser(String name, String id){
        super(name,id);
    }

    public void addNewBook(Book book, SchoolLibrary library){
        library.addNewBook(book);
    }

    public void removeBook(String title, SchoolLibrary library){
        boolean removed = library.removeBook(title);
        if(removed){
            System.out.println("Book removed: " + title);
        }else{
            System.out.println("Book not found");
        }
    }

    /*
     public void updateLibrary(DatabaseController dbController){
     Implementation will occur after Mysql is linked
     }
     */
}