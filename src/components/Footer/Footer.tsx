import React from "react";
import classes from "./Footer.module.css";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className={classes.footer}>
            <div className="container">
                <div className="row">
                    <div className={`col-md-12 ${classes.footerWrap}`}>
                        <div className={classes.left}>
                            <p className={classes.paragraph}>
                                PHODAR Fondation BULGARIA 1510 Sofia, P.O.box: 55
                            </p>
                            <p className={classes.paragraph}>phodar.new@gmail.com</p>
                        </div>

                        <div className={classes.social}>
                            <h4 className={classes.heading}>Follow us</h4>
                            <a
                                className={classes.facebook}
                                target="_blank"
                                href="https://www.facebook.com/phodar.biennial"
                                rel="noopener noreferrer"
                            ></a>
                        </div>

                        <div className={classes.copy}>
              <span>
                © 1999-{currentYear} Phodar. All Rights Reserved.
              </span>
                            <a
                                className={classes.darina}
                                href="https://www.behance.net/darinabojinova"
                                target="_blank"
                                rel="noopener noreferrer"
                            ></a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
