import { Provider, themes, Alert, Flex  } from "@fluentui/react-northstar";
import { ExclamationTriangleIcon } from '@fluentui/react-icons-northstar';
import * as React from "react";

export class ErrorMessage extends React.Component<{},{}>
{

render()
{
    return(

        <Flex styles={{paddingTop: "20px"}} hAlign="center" >
      <Alert
       actions={[
        {
          content: 'Report',
          primary: true,
          key: 'content-1',
        },
      ]}
      warning
      icon={<ExclamationTriangleIcon />}
      header="Server returned error"
      content="The request has failed due to some unknown reasons, Kindly close the window and try again."
    />
    </Flex>
    )

    }
}