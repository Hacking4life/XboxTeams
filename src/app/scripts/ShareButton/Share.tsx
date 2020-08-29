import * as React from "react";
import "bootstrap";
import * as $ from "jquery"

export class Share extends React.Component<{invoke:object},{}> {

    render()
    {
        return(
            <div>
            <link href="https://use.fontawesome.com/releases/v5.6.1/css/all.css" rel="stylesheet" />
            <div className="frame">
              <a href="#" className="btn">
                <i onClick={()=>{this.sharetoTeams(this.props.invoke)}} className="fab fa-xbox" style={{color: '#3b5998'}} />
              </a>
              <a href="#" className="btn">
                <i className="fab fa-dribbble" style={{color: '#ea4c89'}} />
              </a>
              <a href="#" className="btn">
                <i className="far fa-envelope" />
              </a>
            </div>
          </div>
        )
    }

    public sharetoTeams(res :any)

    { 
      let imgsrc : string; 
      let result: any;
       switch(res.type)
      {
        case 'achv':
          var div = $("div[class='item active']").children('div').eq(1);
          imgsrc=  encodeURI(div.children('a').children('img').prop('src'));
          result={
            type:'achv',
            img:imgsrc,
            title:div.children('h4').text(),
            subtext:div.children('h5').text()
          }
          break;
          case 'screenshots':
            var div= $("div[class='item active']");
            imgsrc=  encodeURI(div.children('img').prop('src'));
            result={
              type:'screenshots',
              img:imgsrc,
              title:$("#carousel-text").children('h2').text()
            }
            break;

      }
       microsoftTeams.tasks.submitTask(result, "d7777f39-1e8f-46e8-8aaf-227fcfa4429c");
    }


}