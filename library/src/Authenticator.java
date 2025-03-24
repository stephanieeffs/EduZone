import java.sql.*;

public class Authenticator {

    public static User login(String username, String password) {
        String query = "SELECT * FROM users WHERE username = ? AND password = ?";

        try (Connection conn = DatabaseController.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setString(1, username);
            stmt.setString(2, password);
            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                String role = rs.getString("role");
                String name = rs.getString("username"); // or use a separate 'name' column if you have one
                String id = rs.getString("id");         // assuming ID is stored as VARCHAR

                if (role.equals("librarian")) {
                    return new LibrarianUser(name, id, password);
                } else {
                    return new User(name, id, password);
                }
            } else {
                System.out.println("Invalid username or password.");
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }

        return null;
    }
}
