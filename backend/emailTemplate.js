
export const qrCodeEmailTemplate = ({ inviteeName, inviteeId}) => {
	// const  URL = `http://localhost:3000/confirmation/${inviteeId}`
	const URL = `https://icheckin.netlify.app/confirmation/${inviteeId}`
  let emailContent = `<h2>Dear ${inviteeName}</h2><br>`;
	emailContent += 'You are invited to the upcoming event. Please use this qrCode to checkin'
	emailContent += `<p> Please follow the link below to confirm your participation: </p>`;
	emailContent += `<a href="${URL}">Confirm</a>`
	return emailContent
}