import SibApiV3Sdk from 'sib-api-v3-sdk';

// Set up the Brevo client
const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
const defaultClient = SibApiV3Sdk.ApiClient.instance;

// Configure API key authorization
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = "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"; 

// Send an email using Brevo
export const sendEmail = async (toEmail, subject, htmlContent) => {
  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
  sendSmtpEmail.to = [{ email: toEmail }];
  sendSmtpEmail.sender = { email: 'kesigan2308@gmail.com' }; 
  sendSmtpEmail.subject = subject;
  sendSmtpEmail.htmlContent = htmlContent;

  try {
    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("Email sent successfully:", response);
    return response;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};