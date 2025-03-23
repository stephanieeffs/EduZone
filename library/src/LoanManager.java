import java.sql.*;
import java.time.LocalDate;

public class LoanManager {

    public static void loanBook(String userId, String bookId) {
        String checkQuery = "SELECT status FROM books WHERE id = ?";
        String insertQuery = "INSERT INTO loans (user_id, book_id, loan_date) VALUES (?, ?, ?)";
        String updateBookStatus = "UPDATE books SET status = 'Loaned' WHERE id = ?";
    
        try (Connection conn = DatabaseController.getConnection();
             PreparedStatement checkStmt = conn.prepareStatement(checkQuery);
             PreparedStatement insertStmt = conn.prepareStatement(insertQuery);
             PreparedStatement updateStmt = conn.prepareStatement(updateBookStatus)) {
    
            // Check if book exists and is available
            checkStmt.setString(1, bookId);
            ResultSet rs = checkStmt.executeQuery();
    
            if (!rs.next()) {
                System.out.println("❌ Book not found.");
                return;
            }
    
            String currentStatus = rs.getString("status");
            if (!currentStatus.equalsIgnoreCase("Available")) {
                System.out.println("❌ Book is not available for loan.");
                return;
            }
    
            // Insert loan
            insertStmt.setString(1, userId);
            insertStmt.setString(2, bookId);
            insertStmt.setDate(3, Date.valueOf(LocalDate.now()));
            insertStmt.executeUpdate();
    
            // Update book status
            updateStmt.setString(1, bookId);
            updateStmt.executeUpdate();
    
            System.out.println("Book loaned successfully! ");
    
        } catch (SQLException e) {
            System.out.println("Failed to loan book.");
            e.printStackTrace();
        }
    }
    

    public static void returnBook(String userId, String bookId) {
        String query = "UPDATE loans SET returned = TRUE, return_date = ? WHERE user_id = ? AND book_id = ? AND returned = FALSE";

        try (Connection conn = DatabaseController.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setDate(1, Date.valueOf(LocalDate.now()));
            stmt.setString(2, userId);
            stmt.setString(3, bookId);
            int rows = stmt.executeUpdate();

            if (rows > 0) {
                System.out.println("Book returned successfully.");
            } else {
                System.out.println("No active loan found.");
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public static void viewUserLoans(String userId) {
        String query = "SELECT b.id, b.title, b.author, l.loan_date " +
                       "FROM loans l JOIN books b ON l.book_id = b.id " +
                       "WHERE l.user_id = ? AND l.returned = FALSE";
    
        try (Connection conn = DatabaseController.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {
    
            stmt.setString(1, userId);
            ResultSet rs = stmt.executeQuery();
    
            System.out.println("\n📦 Books currently loaned by you:");
            System.out.printf("%-10s %-35s %-25s %-15s%n", "Book ID", "Title", "Author", "Loan Date");
    
            boolean found = false;
            while (rs.next()) {
                found = true;
                String id = rs.getString("id");
                String title = rs.getString("title");
                String author = rs.getString("author");
                Date loanDate = rs.getDate("loan_date");
    
                System.out.printf("%-10s %-35s %-25s %-15s%n", id, title, author, loanDate);
            }
    
            if (!found) {
                System.out.println("You currently have no books on loan.");
            }
    
        } catch (SQLException e) {
            System.out.println("❌ Error fetching your current loans.");
            e.printStackTrace();
        }
    }
    
}
