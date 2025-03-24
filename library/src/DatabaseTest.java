import java.sql.*;
import java.util.Scanner;

public class DatabaseTest {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        boolean running = true;
    
        while (running) {
            System.out.println("\nWelcome to the School Library System");
            System.out.print("Username: ");
            String username = scanner.nextLine();
            System.out.print("Password: ");
            String password = scanner.nextLine();
    
            User user = Authenticator.login(username, password);
    
            if (user == null) {
                System.out.println("Login failed. Try again.");
                continue;
            }
    
            SchoolLibrary library = new SchoolLibrary();
            boolean loggedIn = true;
    
            while (loggedIn) {
                if (user instanceof LibrarianUser) {
                    LibrarianUser librarian = (LibrarianUser) user;
                    System.out.println("\nLogged in as Librarian: " + librarian.getName());
    
                    System.out.println("Available actions:");
                    System.out.println("1. Add a new book");
                    System.out.println("2. Remove a book");
                    System.out.println("3. View all books");
                    System.out.println("4. Sign out");
                    System.out.println("5. Exit program");
                    System.out.print("Choose an option: ");
                    int option = scanner.nextInt();
                    scanner.nextLine();
    
                    switch (option) {
                        case 1:
                            System.out.print("Enter book ID: ");
                            String id = scanner.nextLine();
                            System.out.print("Enter book title: ");
                            String title = scanner.nextLine();
                            System.out.print("Enter author: ");
                            String author = scanner.nextLine();
                            Book newBook = new Book(id, title, author, "Available");
                            librarian.addNewBook(newBook, library);
                            break;
                        case 2:
                            System.out.print("Enter book title to remove: ");
                            String removeTitle = scanner.nextLine();
                            librarian.removeBook(removeTitle, library);
                            break;
                        case 3:
                            library.viewAllBooks();
                            break;
                        case 4:
                            System.out.println("Signed out.");
                            loggedIn = false;
                            break;
                        case 5:
                            System.out.println("Goodbye!");
                            scanner.close();
                            System.exit(0);
                        default:
                            System.out.println("Invalid option.");
                    }
    
                } else {
                    System.out.println("\nLogged in as User: " + user.getName());
                    System.out.println("Available actions:");
                    System.out.println("1. Return a book");
                    System.out.println("2. Loan a book");
                    System.out.println("3. View all books");
                    System.out.println("4. View my current loans");
                    System.out.println("5. Sign out");
                    System.out.println("6. Exit program");

                    int option = scanner.nextInt();
                    scanner.nextLine();
    
                    switch (option) {
                        case 1:
                            System.out.print("Enter Book ID to return: ");
                            String bookId = scanner.nextLine();
                            user.returnBook(bookId);
                            break;
                        case 2:
                            System.out.print("Enter Book ID to loan: ");
                            String loanBookId = scanner.nextLine();
                            LoanManager.loanBook(user.getID(), loanBookId);
                            break;
                        case 3:
                            library.viewAllBooks();
                            break;
                        case 4:
                            LoanManager.viewUserLoans(user.getID());
                            break;
                        case 5:
                            System.out.println("Signed out.");
                            loggedIn = false;
                            break;
                        case 6:
                            System.out.println("Goodbye!");
                            scanner.close();
                            System.exit(0);
                        default:
                            System.out.println("Invalid option.");
                    }
                    
                }
            }
        }
    }
    

}
