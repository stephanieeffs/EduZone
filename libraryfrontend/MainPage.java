import javax.swing.*;
import javax.swing.border.EmptyBorder;
import java.awt.*;

public class MainPage {

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> new MainPage().createAndShowGUI());
    }

    private void createAndShowGUI() {
        JFrame frame = new JFrame("EduZone Library");
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setSize(1200, 700);
        frame.setLocationRelativeTo(null);

        JPanel mainPanel = new JPanel(new BorderLayout());
        mainPanel.setBackground(Color.WHITE);

        // Top Navigation
        JPanel topNav = new JPanel(new FlowLayout(FlowLayout.RIGHT, 20, 15));
        topNav.setBackground(Color.WHITE);

        JLabel logo = new JLabel("EduZone");
        logo.setFont(new Font("SansSerif", Font.BOLD, 24));
        logo.setForeground(Color.BLACK);

        String[] navItems = {"Library", "Gallery", "Feedback", "Contact"};
        for (String item : navItems) {
            JLabel navLabel = new JLabel(item);
            navLabel.setForeground(Color.GRAY);
            navLabel.setFont(new Font("SansSerif", Font.PLAIN, 16));
            topNav.add(navLabel);
        }

        JButton loginBtn = new JButton("Login");
        loginBtn.setFocusPainted(false);
        topNav.add(loginBtn);

        JPanel headerPanel = new JPanel(new BorderLayout());
        headerPanel.add(logo, BorderLayout.WEST);
        headerPanel.add(topNav, BorderLayout.EAST);
        headerPanel.setBorder(new EmptyBorder(10, 20, 10, 20));
        headerPanel.setBackground(Color.WHITE);

        // Main Content
        JPanel contentPanel = new JPanel();
        contentPanel.setLayout(new BoxLayout(contentPanel, BoxLayout.Y_AXIS));
        contentPanel.setBorder(new EmptyBorder(50, 50, 50, 50));
        contentPanel.setBackground(Color.WHITE);

        JLabel title = new JLabel("Borrow & loan your fav book effortlessly");
        title.setFont(new Font("SansSerif", Font.BOLD, 40));
        title.setForeground(Color.BLACK);

        JLabel description = new JLabel("<html><div style='text-align:left;'>Embark on a literary journey like never before with our revolutionary<br>library application! Introducing a seamless experience<br>that transcends traditional boundaries, where you<br>can effortlessly search your favorite books.</div></html>");
        description.setFont(new Font("SansSerif", Font.PLAIN, 16));
        description.setForeground(Color.DARK_GRAY);

        JButton startBtn = new JButton("Start now →");
        startBtn.setBackground(new Color(81, 156, 251));
        startBtn.setForeground(Color.WHITE);
        startBtn.setFocusPainted(false);
        startBtn.setPreferredSize(new Dimension(150, 40));

        contentPanel.add(title);
        contentPanel.add(Box.createRigidArea(new Dimension(0, 20)));
        contentPanel.add(description);
        contentPanel.add(Box.createRigidArea(new Dimension(0, 30)));
        contentPanel.add(startBtn);

        // Books Panel
        JPanel booksPanel = new JPanel();
        booksPanel.setBackground(new Color(81, 156, 251));
        booksPanel.setPreferredSize(new Dimension(500, 700));
        booksPanel.setLayout(new FlowLayout(FlowLayout.CENTER, 20, 50));

        String[] bookPaths = {"book images/tigertea.jpg", "book images/primaryenglish.png", "book images/busyatmath.jpg", "book images/Bears.png"};
        for (String bookPath : bookPaths) {
            ImageIcon icon = new ImageIcon(bookPath);
            Image scaledImage = icon.getImage().getScaledInstance(120, 160, Image.SCALE_SMOOTH);
            JLabel book = new JLabel(new ImageIcon(scaledImage));
            booksPanel.add(book);
        }

        mainPanel.add(headerPanel, BorderLayout.NORTH);
        mainPanel.add(contentPanel, BorderLayout.WEST);
        mainPanel.add(booksPanel, BorderLayout.EAST);

        frame.add(mainPanel);
        frame.setVisible(true);
    }
}
