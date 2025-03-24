import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class SchoolLibrary {

    public void addBook(Book book) {
        String query = "INSERT INTO books (id, title, author, status) VALUES (?, ?, ?, ?)";

        try (Connection conn = DatabaseController.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setString(1, book.getId());
            stmt.setString(2, book.getTitle());
            stmt.setString(3, book.getAuthor());
            stmt.setString(4, book.getStatus());

            int rowsInserted = stmt.executeUpdate();

            if (rowsInserted > 0) {
                System.out.println(" Book added successfully! " + book.getTitle());
            } else {
                System.out.println(" Book was not added.");
            }

        } catch (SQLException e) {
            System.out.println(" Failed to add book.");
            e.printStackTrace();
        }
    }

    public void removeBook(String title){
        String query = "DELETE FROM books WHERE title = ?";

        try(Connection conn = DatabaseController.getConnection();
            PreparedStatement stmt = conn.prepareStatement(query)){
                stmt.setString(1,title);
                int rowsDeleted = stmt.executeUpdate();

                if(rowsDeleted > 0){
                    System.out.println("Book removed Successfully: " + title);
                }else{
                    System.out.println("No book was found by that title");
                }

            }catch (SQLException e){
                System.out.println("Error while removing book.");
                e.printStackTrace();
            }
     }

      public void viewAllBooks() {
        String query = "SELECT id, title, author, status FROM books";

        try (Connection conn = DatabaseController.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query);
             ResultSet rs = stmt.executeQuery()) {

            System.out.println("\nAll Books:");
            System.out.printf("%-10s %-40s %-25s %-10s%n", "ID", "Title", "Author", "Status");

            while (rs.next()) {
                String id = rs.getString("id");
                String title = rs.getString("title");
                String author = rs.getString("author");
                String status = rs.getString("status");
                System.out.printf("%-10s %-40s %-25s %-10s%n", id, title, author, status);
            }

        } catch (SQLException e) {
            System.out.println(" Failed to fetch books.");
            e.printStackTrace();
        }
    }
}

