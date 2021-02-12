
export const qrCodeEmailTemplate = ({ inviteeName, inviteeQrcode }) => {
  let emailContent = `<h2>Dear ${inviteeName}</h2><br>`;
	emailContent += 'You are invited to the upcoming event. Please use this qrCode to checkin'
	emailContent += `<p> Please click here to confirm your participation </p>`;
	return emailContent
}