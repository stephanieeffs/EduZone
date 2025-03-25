
import javafx.application.Application;
import javafx.beans.value.ChangeListener;
import javafx.geometry.Insets;
import javafx.geometry.Pos;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.control.ScrollPane;
import javafx.scene.effect.DropShadow;
import javafx.scene.image.Image;
import javafx.scene.image.ImageView;
import javafx.scene.layout.Background;
import javafx.scene.layout.BackgroundFill;
import javafx.scene.layout.BorderPane;
import javafx.scene.layout.CornerRadii;
import javafx.scene.layout.HBox;
import javafx.scene.layout.Pane;
import javafx.scene.layout.Priority;
import javafx.scene.layout.Region;
import javafx.scene.layout.VBox;
import javafx.scene.paint.Color;
import javafx.stage.Stage;

public class MainPage extends Application {

    // References for responsive hero layout
    private BorderPane heroPane;
    private VBox textBox;
    private Pane circlePane;

    @Override
    public void start(Stage primaryStage) {
        // 1) Root layout
        BorderPane root = new BorderPane();

        // 2) Header at the top
        HBox header = createHeader();
        root.setTop(header);

        // 3) Hero section in the center
        heroPane = createHeroSection();
        root.setCenter(heroPane);

        ScrollPane scrollPane = new ScrollPane(root);
        scrollPane.setFitToWidth(true);   // Allows content to expand horizontally
        scrollPane.setFitToHeight(false); // 

        // Scene + CSS
        Scene scene = new Scene(scrollPane);
        // Make sure style.css is in src/main/resources/style.css
        scene.getStylesheets().add(getClass().getResource("/style.css").toExternalForm());

        primaryStage.setTitle("EduZone Library");
        primaryStage.setScene(scene);
        primaryStage.show();

        // Basic responsiveness: if width < 900, stack hero content
        ChangeListener<Number> stageSizeListener = (_, _, _) -> {
            double width = scene.getWidth();
            if (width < 900) {
                // Stack: text on top, images on bottom
                heroPane.setTop(textBox);
                heroPane.setBottom(circlePane);
                heroPane.setLeft(null);
                heroPane.setRight(null);
            } else {
                // Side-by-side: text on left, images on right
                heroPane.setLeft(textBox);
                heroPane.setRight(circlePane);
                heroPane.setTop(null);
                heroPane.setBottom(null);
            }
        };
        scene.widthProperty().addListener(stageSizeListener);
    }

    /**
     * Creates a header with logo, nav items, and a login button.
     */
    private HBox createHeader() {
        HBox header = new HBox(15);
        header.setPadding(new Insets(20));
        header.setAlignment(Pos.CENTER_LEFT);

        // Subtle white background
        header.setBackground(
            new Background(new BackgroundFill(Color.WHITE, CornerRadii.EMPTY, Insets.EMPTY))
        );

        Label logo = new Label("EduZone");
        logo.setStyle("-fx-font-size: 24; -fx-font-weight: bold;");

        // Spacer to push nav items + button to the right
        Region spacer = new Region();
        HBox.setHgrow(spacer, Priority.ALWAYS);

        String[] navItems = {"Library", "Gallery", "Feedback", "Contact"};
        HBox navMenu = new HBox(20);
        for (String item : navItems) {
            Label navLabel = new Label(item);
            navLabel.setStyle("-fx-font-size: 16; -fx-text-fill: gray;");
            navMenu.getChildren().add(navLabel);
        }

        Button loginBtn = new Button("Login");
        loginBtn.setStyle("-fx-background-color: #519cfb; -fx-text-fill: white;");

        header.getChildren().addAll(logo, spacer, navMenu, loginBtn);
        return header;
    }

    /**
     * Creates a responsive hero section using BorderPane:
     *  - textBox on the left by default
     *  - circlePane on the right by default
     *  - re-stacks top/bottom if window < 900px
     */
    private BorderPane createHeroSection() {
        BorderPane hero = new BorderPane();
        hero.setPadding(new Insets(30));
        hero.setStyle("-fx-background-color: transparent;");

        // LEFT: textBox
        textBox = new VBox(20);
        textBox.setAlignment(Pos.TOP_LEFT);
        textBox.setStyle("-fx-pref-width: 450;");

        Label title = new Label("Borrow & loan your fav book effortlessly");
        title.setWrapText(true);
        title.setStyle("-fx-font-size: 36; -fx-font-weight: bold;");

        Label description = new Label(
            "Embark on a literary journey like never before with our revolutionary library application! "
          + "Introducing a seamless experience that transcends traditional boundaries, "
          + "where you can effortlessly search your favorite books."
        );
        description.setWrapText(true);
        description.setStyle("-fx-font-size: 14;");

        Button startBtn = new Button("Start now →");
        startBtn.setStyle("-fx-background-color: #519cfb; -fx-text-fill: white;");

        textBox.getChildren().addAll(title, description, startBtn);
        hero.setLeft(textBox);

        // RIGHT: circlePane with circular-arranged book images
        circlePane = new Pane();
        circlePane.setPrefSize(550, 210);

        // Paths to your local images
        String[] bookPaths = {
            "file:///C:/Users/Stephanie/Documents/EduZone/libraryfrontend/BookImages/tigertea.jpg",
            "file:///C:/Users/Stephanie/Documents/EduZone/libraryfrontend/BookImages/primaryenglish.png",
            "file:///C:/Users/Stephanie/Documents/EduZone/libraryfrontend/BookImages/busyatmath.jpg",
            "file:///C:/Users/Stephanie/Documents/EduZone/libraryfrontend/BookImages/Bears.png"
        };

        double centerX = circlePane.getPrefWidth() / 2;
        double centerY = circlePane.getPrefHeight() / 2;
        double radius = 155;
        double angleStep = 360.0 / bookPaths.length;

        for (int i = 0; i < bookPaths.length; i++) {
            ImageView bookImg = createBookImage(bookPaths[i]);
            // Subtle shadow for a floating effect
            bookImg.setEffect(new DropShadow(100, Color.GRAY));

            double angle = Math.toRadians(angleStep * i);
            double x = centerX + radius * Math.cos(angle) - bookImg.getFitWidth() / 2;
            double y = centerY + radius * Math.sin(angle) - bookImg.getFitHeight() / 2;

            bookImg.setLayoutX(x);
            bookImg.setLayoutY(y);
            circlePane.getChildren().add(bookImg);
        }

        hero.setRight(circlePane);

        return hero;
    }

    /**
     * Creates a default-sized ImageView for a given path.
     */
    private ImageView createBookImage(String path) {
        Image image = new Image(path);
        ImageView imageView = new ImageView(image);
        imageView.setFitWidth(150);
        imageView.setFitHeight(200);
        return imageView;
    }

    public static void main(String[] args) {
        launch(args);
    }
}
