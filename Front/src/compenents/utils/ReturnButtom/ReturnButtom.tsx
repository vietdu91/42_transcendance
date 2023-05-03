import React from 'react';
import PropTypes from 'prop-types';

import { useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronCircleLeft } from '@fortawesome/free-solid-svg-icons'

const ReturnButtom = ({colorHexa, path}) => {

	const navigate = useNavigate();

	return (
		<FontAwesomeIcon icon={faChevronCircleLeft}
		style={{color: colorHexa}} onClick={() => navigate(path)}/>
	);
};

ReturnButtom.propTypes = {
	colorHexa: PropTypes.string.isRequired,
	path: PropTypes.string.isRequired,
};

ReturnButtom.defaultProps = {
	colorHexa: "#000000",
	path: "/"
}

export default ReturnButtom;
