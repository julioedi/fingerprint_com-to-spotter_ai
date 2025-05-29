import React, { AnchorHTMLAttributes, Component } from "react";
import "@root/styles/graphCard.scss";

type a  = AnchorHTMLAttributes<HTMLAnchorElement>;
interface ButtonProps extends a {
    filled?:boolean,
    type?:'default'|'primary',
    
}

export default class extends Component<ButtonProps> {
    static defaultProps:ButtonProps = {
        filled: true,
        type:"default"
    }
    getClassName = () =>{
        const {className,filled,type} = this.props
        const out = ["btn"];
        if (filled) {
            out.push("filled");
        }
        if (type) {
            out.push("type");
        }
        if (className) {
             out.push(className);
        }
        return out.join(" ");
    }
    render(): React.ReactNode {
        const {children,filled,type,className,...props} = this.props;
        return(
            <a className={this.getClassName()} {...props}>
                {children}
            </a>
        )
    }
}