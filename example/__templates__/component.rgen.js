export default `
    import * as React from "react";

    export default ${rgen.filename} extends React.Component {
        render() {
            return (
                <div>${rgen.filename}</div>
            );
        }
    }
`;