import React, { Fragment } from "react";

const Header = (props) => {

    return (
		<Fragment>

			{props.headers.map((text, index) => (

				<div className={`header${index}`} key={index}>
					{text}
				</div>

			))}

		</Fragment>
    )

}

export default Header;
