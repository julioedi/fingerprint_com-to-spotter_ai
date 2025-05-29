import React,{Component, HtmlHTMLAttributes} from "react";

type div = HtmlHTMLAttributes<HTMLDivElement>;
interface WrapProps extends div{
    containerProps?:div
}

export default class extends Component<WrapProps>{
    render(): React.ReactNode {
        const {className,containerProps,children,...props} = this.props;
        const container = containerProps || {} as div;
        
        const childClassname = ((className ?? "") + " mws dashed-left dashed-right").trim();
        return(
            <section
            {...container}
            data-section-core=""
            >
            <div className={childClassname} {...props}>
                {children}
            </div>
            </section>
        )
    }
}