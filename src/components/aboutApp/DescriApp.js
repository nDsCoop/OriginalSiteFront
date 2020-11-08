import React, { Component } from "react";
import { Typography, Divider, Container, Link } from "@material-ui/core";

export default class DescriApp extends Component {
    render(){
      
        return (

            <div className="privacy-app">
                <Container maxWidth="sm">
              <header>
                <Typography variant="h4" gutterBottom={true}>
                  Introductory{" "}
                </Typography>
              </header>
              <div className="deliver"></div>
              <br />
              <section>
                <Typography gutterBottom={true} variant="subtitle1">
                  The nDsApp is a web application that simultaneously serves as a spiritual product built
                  and operated by nDs Gruop in the present time and will continue to grow in the future.
                  (nDsApp là một ứng dụng web đồng thời đóng vai trò như một sản phẩm tinh thần được xây dựng
                  và được vận hành bởi nhóm nDs trong thời điểm hiện tại và sẽ tiếp tục phát triển trong tương lai.)
                  <br />
                  With a passionate about learning and passionate about programming, especially on Reactjs and Nodejs platforms,
                  We built this app for community-serving purposes. It is also a turning point for pursuing your own passion.
                  The App is not just an individual product but also a brainchild of us.
                  (Với sự say mê học hỏi và đam mê lập trình, đặc biệt trên nền tảng Reactjs và Nodejs,
                  Chúng tôi xây dựng ứng dụng này nhằm mục đích phục vụ chung cho mọi người tham gia.
                  Đồng thời cũng là một bước ngoặc cho việc theo đuổi đam mê của bản thân. 
                  App Không chỉ là một sản phẩm cá nhân mà còn là một đứa con tinh thần của chúng tôi.)
                  <br />
                  From the initial idea and after nearly 2 months, the App was officially put into operation by the host platform from 
                  Heroku / Ocean with 3 servers operating simultaneously, including 1 Front-End and 2 Back-End.
                  We are always looking for the best way to improve the speed and information security for both parties.
                  (Từ ý tưởng ban đầu và sau thời gian gần 2 tháng  App được đưa vào hoạt động chính thức công khai nhờ nền nản host từ 
                  Heroku/Ocean với 3 server hoạt động đồng thời gồm 1 Front-End và 2 Back-End.
                  Chúng tôi luôn tìm cách tốt nhất để cải thiện tốc độ cũng như độ an toàn thông tin cho cả đôi bên.)
                  <br />
                </Typography>
                <Typography variant="h6">  Basic Information of nDsApp </Typography>
                <Typography gutterBottom={true}>
                  nDs App is built with a main color tone and common wallpaper on many pages to create a unified monochrome feel for the application theme interface.
                  (nDs App được xây dựng với một tông màu chủ đạo và hình nền chung trên nhiều trang để tạo cảm giác đơn sắc thống nhất cho giao diện chủ đề ứng dụng.)
                  <br />
                  At the beginning of the app's operation, there were 3 active applications including Music mp3, Weather search for cities in the world and 
                  the main application was online chat and video chat room individuals or groups with your friends. At the same time 2 active servers also provide the main environment for 2 large applications to operate.
                  (Tại thời gian đầu đi vào hoạt động app hiện có 3 ứng dụng đang hoạt động gồm Music mp3, Tra cứu thời tiết các thành phố thế giới và ứng dụng chính là chat online và tạo phòng chat video 
                  cá nhân hoặc nhóm cùng bạn bè của bạn. Đồng thời 2 server đang hoạt động  cũng cũng cấp môi trường chính cho 2 app lớn hoạt động)
                </Typography>
                <Typography variant="h6">Continued To Grow</Typography>
                <Typography gutterBottom={true}>
                  Currently we have the application running on the host platform with the server being free and their main server is not located in Vietnam,
                  so there will be a lot of influence on the application's operation as well as the user experience. . But nDs always ensure the confidentiality and safety of the information 
                  you provide us. And this issue will be resolved soon.
                  (Hiện tại chúng tôi cho ứng dụng đang hoạt động trên nền host với máy chủ là miễn phí và máy chủ chính của họ không đặt tại 
                  Việt Nam nên sẽ còn nhiều ảnh hưởng cho hoạt động của ứng dụng cũng như là trải nghiệm của người dùng. Nhưng phía nDs luôn đảm bảo tính bảo mật và an toàn về thông tin
                  mà bạn cung cấp cho chúng tôi. Và vấn đề này sẽ sớm được giải quyết.)
                </Typography>
               
                <Typography variant="h6">Changes to Introductory</Typography>
                <Typography gutterBottom={true}>
                  nDsApp will be monitored and updated continuously by the development team. That is why introductions can be changed from time to time and they will be rapidly updated 
                  by the group as there are any new releases to provide you with our app information in total. most important possible.
                  (nDsApp sẽ được nhóm phát triển theo dõi và cập nhật liên tục. Đó là lí do lời giới thiệu có thể được thay đổi theo thời gian và chúng sẽ được nhóm cập nhật liên tục 
                  khi có bất kì bản phát hành mới nào để cung cấp cho bạn các thông tin ứng dụng của chúng tôi một cách tổng quan nhất có thể.)
               
                </Typography>
        
                <Typography variant="h6">Current Version</Typography>
                    Version 0.1.0 | Official
                    <br />
                    Accept Login User Account at 3 Pages
                    <br />
                    Listen MP3 music | Get Weather any City Where | Chat text, img, wav, mp3, mp4, files message | Get Face moment One or One person group in a Room
              </section>
            </Container>
            </div>
          );
        }
   
}
