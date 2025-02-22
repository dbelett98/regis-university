public class Inventory {
    private int productId;
    private String productName;
    private int quantity;
    private double price;

    // Constructors
    public Inventory() { }

    public Inventory(int productId, String productName, int quantity, double price) {
        this.productId = productId;
        this.productName = productName;
        this.quantity = quantity;
        this.price = price;
    }


    // Use Case Method: Check Inventory
    public boolean isAvailable(int requestedQuantity) {
        return quantity >= requestedQuantity;
    }

    // Business Method: Reduce Quantity
    public void reduceQuantity(int amount) {
        if (isAvailable(amount)) {
            quantity -= amount;
        } else {
            System.out.println("Not enough inventory for product: " + productName);
        }
    }

    // toString() Method
    @Override
    public String toString() {
        return "Inventory{" +
               "productId=" + productId +
               ", productName='" + productName + '\'' +
               ", quantity=" + quantity +
               ", price=" + price +
               '}';
    }
}
