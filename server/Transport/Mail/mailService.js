import SibApiV3Sdk from "sib-api-v3-sdk";

// Set up the Brevo client
const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
const defaultClient = SibApiV3Sdk.ApiClient.instance;

// Configure API key authorization
const apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey =
  "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"; // Use your Brevo API Key

// Send an email using Brevo
export const sendEmail = async (toEmail, subject, htmlContent) => {
  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
  sendSmtpEmail.to = [{ email: toEmail }];
  sendSmtpEmail.sender = { email: "jthivyanp@gmail.com" }; // Replace with your email
  sendSmtpEmail.subject = subject;
  sendSmtpEmail.htmlContent = htmlContent;

  try {
    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("Email sent successfully:", response);
    return response;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};
