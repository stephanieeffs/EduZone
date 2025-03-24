import javafx.application.Application;
import javafx.scene.Scene;
import javafx.scene.control.Label;
import javafx.scene.control.ScrollPane;
import javafx.scene.control.ScrollPane.ScrollBarPolicy;
import javafx.scene.layout.VBox;
import javafx.scene.layout.HBox;
import javafx.scene.image.Image;
import javafx.scene.image.ImageView;
import javafx.stage.Stage;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class LibraryUI extends Application {

    @Override
    public void start(Stage primaryStage) {
        // 1) Fetch all books from your DB or your SchoolLibrary class
        List<Book> allBooks = fetchAllBooksFromDatabase();

        // 2) Group books by grade
        Map<Integer, List<Book>> booksByGrade = allBooks.stream()
            .collect(Collectors.groupingBy(Book::getGradeLevel));

        // 3) Main vertical container
        VBox mainLayout = new VBox(20); // spacing of 20 between rows

        // 4) For each grade, create a row with horizontally scrollable covers
        booksByGrade.keySet().stream().sorted().forEach(grade -> {
            // Label for the grade
            Label gradeLabel = new Label("Grade " + grade);
            gradeLabel.setStyle("-fx-font-size: 18; -fx-font-weight: bold;");

            // Horizontal container for covers
            HBox bookRow = new HBox(10); // spacing of 10 between covers

            // Add each book’s cover to the row
            for (Book book : booksByGrade.get(grade)) {
                ImageView coverView = createCoverImageView(book.getCoverImageUrl());
                bookRow.getChildren().add(coverView);
            }

            // Make the row scrollable horizontally
            ScrollPane scrollPane = new ScrollPane(bookRow);
            scrollPane.setHbarPolicy(ScrollBarPolicy.AS_NEEDED);
            scrollPane.setVbarPolicy(ScrollBarPolicy.NEVER);
            scrollPane.setFitToHeight(true);

            // Add label + scrollpane to the main layout
            mainLayout.getChildren().addAll(gradeLabel, scrollPane);
        });

        // 5) Set up the scene
        Scene scene = new Scene(mainLayout, 900, 600);
        primaryStage.setTitle("K-6 School Library");
        primaryStage.setScene(scene);
        primaryStage.show();
    }

    private List<Book> fetchAllBooksFromDatabase() {
        // You can directly call your DB code here or from a dedicated method/class
        // For example:
        // return new DatabaseManager().getAllBooks();
        return null; // placeholder
    }

    private ImageView createCoverImageView(String url) {
        // Load image
        Image image = new Image(url, 120, 180, false, true); 
        // width=120, height=180, preserveRatio=false, smooth=true
        ImageView imageView = new ImageView(image);
        // Adjust if you want clickable images, etc.
        return imageView;
    }

    public static void main(String[] args) {
        launch(args);
    }
}
