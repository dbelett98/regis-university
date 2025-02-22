public class Payment {
    private static int paymentCounter = 5000;
    private int paymentId;
    private Order order;
    private String paymentMethod;
    private double amount;

    // Constructors
    public Payment() { }

    public Payment(Order order, String paymentMethod) {
        this.paymentId = paymentCounter++;
        this.order = order;
        this.paymentMethod = paymentMethod;
        this.amount = order.getTotalAmount();
    }

    // Use Case Method: Process Payment
    public boolean processPayment() {
        // Simplified payment processing logic
        System.out.println("Processing payment of $" + amount + " for Order ID: " + order.getOrderId());
        return true; // Assuming payment is always successful
    }

    // Factory Method
    public static Payment makePayment(Order order, String paymentMethod) {
        Payment payment = new Payment(order, paymentMethod);
        boolean success = payment.processPayment();
        if (success) {
            System.out.println("Payment successful: " + payment);
        } else {
            System.out.println("Payment failed for Order ID: " + order.getOrderId());
        }
        return payment;
    }

    // toString() Method
    @Override
    public String toString() {
        return "Payment{" +
               "paymentId=" + paymentId +
               ", order=" + order +
               ", paymentMethod='" + paymentMethod + '\'' +
               ", amount=" + amount +
               '}';
    }
}
