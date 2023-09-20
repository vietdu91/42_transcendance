import { Snackbar, SnackbarContent, IconButton } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

export default function SnackBarCustom({ open, setOpen, message }) {
	return (
		<Snackbar
			open={open}
			autoHideDuration={6000} // Durée d'affichage du snackbar en millisecondes
			onClose={() => setOpen(false)}
		>
			<SnackbarContent
				message={message}
				action={
					<IconButton
						size="small"
						aria-label="close"
						color="inherit"
						onClick={() => setOpen(false)}
					>
						<CloseIcon fontSize="small" />
					</IconButton>
				}
			/>
		</Snackbar>
	);
}