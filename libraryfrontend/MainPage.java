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
        logo.setFont(new Font("SansSerif", Font.BOLD, 20));
        logo.setForeground(Color.BLACK);

        String[] navItems = {"Library", "Gallery", "Feedback", "Contact"};
        for (String item : navItems) {
            JLabel navLabel = new JLabel(item);
            navLabel.setForeground(Color.GRAY);
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
        JPanel contentPanel = new JPanel(new GridBagLayout());
        contentPanel.setBackground(Color.WHITE);

        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(10, 20, 10, 20);
        gbc.anchor = GridBagConstraints.WEST;

        JLabel title = new JLabel("<html><div style='font-size:40px;'>Borrow & loan your <span style='color:#519cfb;'>fav book</span><br>effortlessly</div></html>");
        JLabel description = new JLabel("<html>Embark on a literary journey like never before with our revolutionary<br>library application! Introducing a seamless experience<br>that transcends traditional boundaries, where you<br>can effortlessly search your favorite books.</html>");
        JButton startBtn = new JButton("Start now →");
        startBtn.setBackground(new Color(81, 156, 251));
        startBtn.setForeground(Color.WHITE);
        startBtn.setFocusPainted(false);

        gbc.gridx = 0;
        gbc.gridy = 0;
        contentPanel.add(title, gbc);

        gbc.gridy = 1;
        contentPanel.add(description, gbc);

        gbc.gridy = 2;
        contentPanel.add(startBtn, gbc);

        // Books Panel
        JPanel booksPanel = new JPanel();
        booksPanel.setBackground(new Color(81, 156, 251));
        booksPanel.setPreferredSize(new Dimension(500, 700));
        booksPanel.setLayout(null);

        // Sample book images
        String[] bookPaths = {"the tiger who came to tea.jpg", "book2.png", "book3.png", "book4.png"};

        for (int i = 0; i < bookPaths.length; i++) {
            JLabel book = new JLabel(new ImageIcon(bookPaths[i]));
            book.setBounds(60 + i * 100, 100 + i * 100, 120, 160);
            booksPanel.add(book);
        }

        mainPanel.add(headerPanel, BorderLayout.NORTH);
        mainPanel.add(contentPanel, BorderLayout.CENTER);
        mainPanel.add(booksPanel, BorderLayout.EAST);

        frame.add(mainPanel);
        frame.setVisible(true);
    }
}
