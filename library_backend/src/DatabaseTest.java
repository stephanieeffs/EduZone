import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class DatabaseTest {
    public static void main(String[] args) {
        String url = "jdbc:mysql://localhost:3306/LibraryDB";
        String user = "root"; // Change to your MySQL username
        String password = ""; // Change to your MySQL password

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            Connection conn = DriverManager.getConnection(url, user, password);
            System.out.println("Successfully connected to MySQL database!");

            // Query to fetch books
            String query = "SELECT * FROM books";
            PreparedStatement stmt = conn.prepareStatement(query);
            ResultSet rs = stmt.executeQuery();

            // Display books
            while (rs.next()) {
                System.out.println("Book: " + rs.getString("title") + " by " + rs.getString("author"));
            }

            conn.close();
        } catch (Exception e) {
            System.out.println(" Error connecting to MySQL!");
            e.printStackTrace();
        }
    }
}
