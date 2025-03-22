import java.sql.Connection;
import java.sql.PreparedStatement;
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
    }

