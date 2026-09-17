import { topicLenses } from './topicLenses.js';
// Original Vietnamese interpretations; each row contains distinct upright and reversed themes.
const major = [
['The Fool','Kẻ Khờ','khởi đầu,tự do,tin tưởng','Một khởi đầu mở ra khi bạn sẵn lòng bước khỏi vùng quen thuộc','Sự bốc đồng hoặc nỗi sợ bước tiếp đang cần được nhìn nhận','Thử một bước nhỏ, đồng thời kiểm tra rủi ro',1,0],
['The Magician','Nhà Ảo Thuật','chủ động,kỹ năng,tiềm năng','Bạn có những nguồn lực cần thiết để biến ý tưởng thành hành động','Tài năng bị phân tán hoặc lời hứa chưa đi kèm hành động','Chọn một mục tiêu và dùng nguồn lực thực tế',2,-1],
['The High Priestess','Nữ Tư Tế','trực giác,tĩnh lặng,bí mật','Khoảng lặng giúp bạn nhận ra điều cảm xúc đang muốn nói','Tiếng ồn bên ngoài có thể khiến bạn bỏ qua nhu cầu thật','Lắng nghe trực giác nhưng đối chiếu với sự thật',0,0],
['The Empress','Hoàng Hậu','nuôi dưỡng,sáng tạo,phong phú','Sự chăm sóc đều đặn tạo điều kiện cho điều tốt đẹp phát triển','Cho đi quá mức có thể khiến bạn cạn kiệt','Dành sự chăm sóc cho cả bản thân',2,0],
['The Emperor','Hoàng Đế','cấu trúc,kỷ luật,trách nhiệm','Ranh giới rõ ràng và sự nhất quán mang lại nền tảng vững','Kiểm soát quá chặt hoặc thiếu trật tự tạo ra căng thẳng','Xây dựng nguyên tắc linh hoạt và công bằng',1,-1],
['The Hierophant','Giáo Hoàng','truyền thống,học hỏi,niềm tin','Kinh nghiệm từ người hướng dẫn và giá trị chung có thể hữu ích','Khuôn mẫu cũ có thể không còn phù hợp với bạn','Xem lại điều bạn tin và lý do bạn tin',1,0],
['The Lovers','Người Tình','kết nối,lựa chọn,hòa hợp','Sự đồng điệu đòi hỏi một lựa chọn phù hợp với giá trị thật','Bất đồng về giá trị hoặc sự do dự cần được làm rõ','Lựa chọn bằng sự chân thành và trách nhiệm',2,-1],
['The Chariot','Cỗ Xe','ý chí,tiến bước,định hướng','Mục tiêu rõ ràng giúp bạn điều phối những lực kéo trái chiều','Nóng vội hoặc mất phương hướng đang làm hao sức','Giữ nhịp tiến phù hợp với khả năng',2,-1],
['Strength','Sức Mạnh','kiên nhẫn,dũng cảm,nhân ái','Sự mềm mỏng và bền bỉ có thể hóa giải áp lực','Thiếu tự tin hoặc cố kìm nén cảm xúc làm bạn mệt mỏi','Đối xử với mình bằng lòng kiên nhẫn',2,0],
['The Hermit','Ẩn Sĩ','chiêm nghiệm,khoảng lặng,tự hiểu','Một khoảng riêng giúp bạn tìm được câu trả lời bên trong','Thu mình quá lâu có thể ngăn bạn nhận sự hỗ trợ','Tạo khoảng lặng nhưng đừng cắt mọi kết nối',0,-1],
['Wheel of Fortune','Bánh Xe Số Phận','chu kỳ,thay đổi,cơ hội','Hoàn cảnh đang chuyển động và mở ra một chu kỳ khác','Kháng cự thay đổi hoặc lặp lại thói quen cũ gây mắc kẹt','Tập trung vào phần bạn có thể chủ động',1,0],
['Justice','Công Lý','công bằng,sự thật,trách nhiệm','Một quyết định cân bằng cần dựa trên sự thật và hệ quả','Thiên kiến hoặc né tránh trách nhiệm khiến đánh giá lệch đi','Kiểm tra dữ kiện trước khi kết luận',1,-1],
['The Hanged Man','Người Treo Ngược','tạm dừng,góc nhìn,buông bỏ','Tạm dừng có thể giúp bạn nhìn vấn đề từ góc khác','Trì hoãn vô hạn hoặc hy sinh thiếu giới hạn cần được xem lại','Đặt thời hạn cho việc chờ đợi',0,-1],
['Death','Chuyển Hóa','kết thúc,chuyển hóa,đổi mới','Một giai đoạn khép lại tạo khoảng trống cho cách sống mới','Bám vào điều đã cũ có thể kéo dài cảm giác bế tắc','Cho phép một thói quen không còn hữu ích kết thúc',0,-1],
['Temperance','Tiết Chế','cân bằng,điều hòa,hồi phục','Các khác biệt có thể hòa hợp qua điều chỉnh kiên nhẫn','Nhịp sống mất cân bằng cần được điều chỉnh','Tìm mức vừa đủ thay vì cực đoan',2,0],
['The Devil','Ràng Buộc','phụ thuộc,cám dỗ,nhận thức','Một ràng buộc hoặc ham muốn đang thu hẹp quyền lựa chọn','Bạn có thể đang nhận diện và tháo gỡ một sự phụ thuộc','Gọi tên giới hạn và tìm hỗ trợ khi cần',-2,1],
['The Tower','Tòa Tháp','đổ vỡ,thức tỉnh,tái thiết','Một giả định thiếu vững chắc có thể cần được xem xét lại','Nỗi sợ thay đổi có thể khiến bạn trì hoãn việc sửa nền móng','Ưu tiên điểm tựa thực tế và thay đổi từng bước',-2,-1],
['The Star','Ngôi Sao','hy vọng,chữa lành,niềm tin','Hy vọng trở lại khi bạn cho mình thời gian hồi phục','Mất niềm tin tạm thời có thể che đi những tiến bộ nhỏ','Ghi nhận một dấu hiệu hồi phục mỗi ngày',2,0],
['The Moon','Mặt Trăng','mơ hồ,tiềm thức,cảm xúc','Cảm xúc mạnh và thông tin chưa đầy đủ khiến mọi thứ khó rõ','Sự mơ hồ có thể dần tan khi bạn kiểm chứng điều lo sợ','Phân biệt điều bạn biết với điều bạn đang đoán',-1,0],
['The Sun','Mặt Trời','rõ ràng,niềm vui,sức sống','Sự cởi mở và rõ ràng tạo điều kiện cho niềm vui','Niềm vui bị trì hoãn hoặc kỳ vọng quá cao làm giảm sự hài lòng','Trân trọng tiến bộ thực tế và chia sẻ chân thành',2,1],
['Judgement','Phán Xét','thức tỉnh,đánh giá,làm mới','Nhìn lại lựa chọn cũ giúp bạn đưa ra quyết định trưởng thành','Tự trách hoặc né tránh bài học khiến bạn khó bước tiếp','Rút ra bài học mà không kết án bản thân',1,0],
['The World','Thế Giới','hoàn thành,hội nhập,trọn vẹn','Một chặng đường có thể đạt sự hoàn thiện và mở rộng tầm nhìn','Một việc còn dang dở cần được khép lại trước khi bước tiếp','Hoàn tất điều còn thiếu và ghi nhận hành trình',2,0],
];
const minor = {
 Cups: [
 ['khởi mở,cảm xúc','Cảm xúc mới hoặc sự cởi mở có thể nảy nở','Cảm xúc bị giữ lại hoặc bạn cần chăm sóc mình trước','Cho cảm xúc một cách biểu đạt lành mạnh',2,0],
 ['đồng điệu,hợp tác','Sự trao đổi hai chiều tạo nên kết nối bình đẳng','Mất cân bằng cho và nhận khiến kết nối xa cách','Lắng nghe và nói rõ mong đợi của cả hai',2,-1],
 ['hội ngộ,cộng đồng','Niềm vui có thể đến từ bạn bè và sự hỗ trợ tập thể','Mâu thuẫn nhóm hoặc quá phụ thuộc sự công nhận gây khó chịu','Tìm cộng đồng khiến bạn được là chính mình',2,0],
 ['chán nản,suy ngẫm','Bạn cần nhìn lại nhu cầu trước những cơ hội đang có','Sự quan tâm có thể trở lại sau một giai đoạn khép mình','Quan sát cơ hội nhỏ đang ở gần',0,1],
 ['tiếc nuối,mất mát','Nỗi tiếc nuối đang chiếm nhiều chú ý hơn phần còn lại','Bạn có thể bắt đầu chấp nhận và nhìn thấy điều còn giá trị','Cho mình thời gian buồn và tìm điểm tựa',-1,1],
 ['ký ức,thân thuộc','Ký ức và sự tử tế cũ có thể đem lại cảm giác ấm áp','Lý tưởng hóa quá khứ có thể ngăn bạn sống ở hiện tại','Giữ bài học đẹp mà không mắc kẹt trong hoài niệm',1,0],
 ['lựa chọn,tưởng tượng','Nhiều khả năng xuất hiện nhưng cần phân biệt mong muốn với thực tế','Bạn có thể thu hẹp lựa chọn hoặc vẫn lúng túng vì thiếu tiêu chí','Viết ra tiêu chí trước khi chọn',0,0],
 ['rời đi,tìm kiếm','Bạn có thể muốn rời điều không còn nuôi dưỡng mình','Do dự giữa ở lại và rời đi cần được nhìn nhận thành thật','Xác định nhu cầu cốt lõi trước khi thay đổi',-1,0],
 ['hài lòng,ước nguyện','Sự hài lòng đến từ việc nhận ra điều mình đã có','Thỏa mãn bề ngoài có thể chưa đáp ứng nhu cầu sâu hơn','Định nghĩa hạnh phúc theo giá trị của mình',2,0],
 ['gia đình,hòa thuận','Sự gắn bó và giá trị chung có thể tạo cảm giác thuộc về','Hình ảnh hạnh phúc lý tưởng có thể che những khác biệt thật','Tạo không gian trò chuyện trong gia đình',2,-1],
 ['nhạy cảm,tin mới','Một lời mời hoặc ý tưởng cảm xúc mới đáng được đón nhận','Nhạy cảm quá mức hoặc ngại thể hiện khiến bạn hiểu lầm','Bày tỏ nhẹ nhàng và hỏi lại khi chưa rõ',1,0],
 ['lãng mạn,lý tưởng','Bạn được thôi thúc theo đuổi điều khiến trái tim rung động','Lý tưởng hóa hoặc hứa nhiều làm cảm xúc thiếu chỗ dựa','Để hành động đi cùng lời nói',1,-1],
 ['thấu cảm,trực giác','Sự thấu cảm giúp bạn chăm sóc những nhu cầu tinh tế','Hấp thụ quá nhiều cảm xúc của người khác làm bạn kiệt sức','Giữ ranh giới trong khi vẫn quan tâm',2,0],
 ['điềm tĩnh,trưởng thành','Bạn có thể giữ sự bình tĩnh giữa những cảm xúc mạnh','Cảm xúc bị dồn nén hoặc thiếu ổn định cần được chăm sóc','Nhận diện cảm xúc trước khi phản ứng',2,-1],
 ],
 Wands: [
 ['cảm hứng,khởi sự','Một tia cảm hứng có thể trở thành khởi đầu sáng tạo','Động lực chưa ổn định hoặc thời điểm chưa phù hợp','Thử ý tưởng ở quy mô nhỏ trước',2,0],
 ['tầm nhìn,kế hoạch','Bạn đang nhìn xa hơn và cân nhắc hướng phát triển','Sợ điều chưa biết có thể giữ bạn trong kế hoạch cũ','So sánh hai hướng bằng tiêu chí cụ thể',1,0],
 ['mở rộng,chờ đợi','Nỗ lực ban đầu mở ra triển vọng phát triển','Chậm trễ hoặc giới hạn thực tế đòi hỏi điều chỉnh kế hoạch','Kiểm tra tiến độ và chuẩn bị phương án khác',2,0],
 ['cột mốc,ổn định','Một cột mốc xứng đáng được ghi nhận cùng người đồng hành','Nền tảng chung chưa vững hoặc niềm vui bị trì hoãn','Củng cố cam kết bằng việc nhỏ cụ thể',2,0],
 ['cạnh tranh,khác biệt','Các quan điểm cạnh tranh có thể giúp làm rõ điều quan trọng','Né tránh bất đồng hoặc căng thẳng ngầm cần được xử lý','Thống nhất luật trao đổi trước khi tranh luận',-1,0],
 ['ghi nhận,tự tin','Nỗ lực có thể nhận được sự ghi nhận xứng đáng','Phụ thuộc tiếng khen hoặc thiếu công nhận làm bạn nản','Đánh giá tiến bộ bằng tiêu chuẩn của mình',2,0],
 ['bảo vệ,kiên định','Bạn cần đứng vững trước áp lực lên quan điểm của mình','Phòng thủ liên tục có thể khiến bạn kiệt sức','Chọn điều đáng bảo vệ và điều có thể linh hoạt',1,-1],
 ['tốc độ,tiến triển','Thông tin và sự kiện có thể tiến triển nhanh','Chậm trễ hoặc vội vã khiến thông điệp dễ sai lệch','Xác nhận thông tin trước khi hành động',2,-1],
 ['bền bỉ,cảnh giác','Kinh nghiệm giúp bạn bền bỉ dù đang mệt mỏi','Căng mình quá lâu làm bạn khó đón nhận hỗ trợ','Nghỉ ngơi trước khi tiếp tục',1,-1],
 ['gánh nặng,trách nhiệm','Bạn có thể đang ôm nhiều trách nhiệm hơn sức mình','Buông bớt gánh nặng hoặc tránh trách nhiệm đều cần cân nhắc','Phân chia công việc và đặt giới hạn',-1,0],
 ['khám phá,nhiệt huyết','Tinh thần khám phá khuyến khích bạn thử điều mới','Hào hứng ban đầu thiếu kế hoạch dễ tan nhanh','Biến tò mò thành một thử nghiệm nhỏ',1,0],
 ['phiêu lưu,hành động','Sự nhiệt tình thúc đẩy bạn tiến lên mạnh mẽ','Hấp tấp hoặc thay đổi thất thường làm mất phương hướng','Giữ nhiệt huyết nhưng kiểm tra hệ quả',1,-1],
 ['tự tin,ấm áp','Sự tự tin và ấm áp giúp bạn lan tỏa cảm hứng','So sánh hoặc thiếu tự tin che khuất sức sáng tạo','Dành chỗ cho cách thể hiện riêng của bạn',2,0],
 ['lãnh đạo,tầm nhìn','Tầm nhìn dài hạn có thể kết nối mọi người cùng hành động','Áp đặt hoặc kỳ vọng quá cao làm đội ngũ mất động lực','Dẫn dắt bằng ví dụ và lắng nghe phản hồi',2,-1],
 ],
 Swords: [
 ['sáng tỏ,sự thật','Một nhận thức rõ ràng giúp bạn gọi đúng tên vấn đề','Thông tin thiếu chính xác hoặc tư duy rối cần được gỡ','Tách dữ kiện khỏi suy diễn',1,0],
 ['do dự,cân nhắc','Bạn đang cân nhắc giữa những lựa chọn chưa đủ thông tin','Né tránh quyết định hoặc quá tải thông tin khiến bạn khó chọn','Tìm dữ kiện còn thiếu trước khi quyết',0,-1],
 ['tổn thương,sự thật','Một điều khó chấp nhận cần được nhìn nhận và chữa lành','Bạn có thể đang hồi phục hoặc còn giữ nỗi đau cũ','Tìm một người đáng tin để chia sẻ',-2,0],
 ['nghỉ ngơi,phục hồi','Tạm nghỉ giúp tâm trí phục hồi và đánh giá tỉnh táo','Không cho mình nghỉ hoặc thu mình quá lâu làm mất nhịp','Sắp xếp thời gian nghỉ thực sự',0,0],
 ['xung đột,cái giá','Một cuộc tranh hơn thua có thể gây tổn hại kết nối','Bạn có thể muốn hòa giải nhưng cần nhìn nhận hậu quả','Ưu tiên sự tôn trọng hơn việc thắng',-2,0],
 ['chuyển tiếp,bình yên','Rời một giai đoạn căng thẳng cần sự kiên nhẫn','Điều chưa giải quyết có thể khiến quá trình chuyển tiếp chậm','Mang theo bài học thay vì mọi gánh nặng',1,0],
 ['chiến lược,kín đáo','Bạn cần xem lại cách trao đổi và phần thông tin còn thiếu','Sự thật có thể rõ hơn khi bạn chủ động minh bạch','Kiểm chứng trước khi nghi ngờ động cơ của ai',-1,0],
 ['giới hạn,bế tắc','Những niềm tin giới hạn có thể khiến lựa chọn trông ít hơn thực tế','Bạn có thể đang nhận ra lối thoát khỏi cách nghĩ cũ','Tìm một hành động nhỏ trong tầm kiểm soát',-1,1],
 ['lo âu,trăn trở','Nỗi lo có thể đang lớn hơn những dữ kiện hiện có','Chia sẻ nỗi lo có thể giúp bạn thoát vòng suy nghĩ lặp lại','Viết rõ điều lo và nguồn hỗ trợ có thể tìm',-2,0],
 ['kết thúc,buông xuống','Một chu kỳ khó khăn cần được khép lại và hồi phục','Bạn có thể đang hồi phục dù vẫn sợ lặp lại tổn thương','Bắt đầu lại bằng một nhịp độ nhẹ nhàng',-2,1],
 ['tò mò,quan sát','Sự tò mò giúp bạn tìm hiểu và hỏi những câu cần thiết','Tin đồn hoặc phản ứng vội có thể gây hiểu lầm','Kiểm tra nguồn trước khi chia sẻ',1,-1],
 ['quyết đoán,tốc độ','Bạn có động lực xử lý vấn đề trực diện','Lời nói sắc hoặc hành động hấp tấp có thể làm tổn thương','Dừng một nhịp để cân nhắc cách diễn đạt',1,-1],
 ['sáng suốt,ranh giới','Sự sáng suốt giúp bạn đặt ranh giới rõ ràng','Khắt khe với mình hoặc người khác có thể khiến giao tiếp lạnh','Nói thật với sự tử tế',1,0],
 ['lý trí,nguyên tắc','Lý trí và tiêu chuẩn nhất quán giúp đưa ra quyết định','Sự cứng nhắc hoặc dùng lý lẽ để áp đặt cần được xem lại','Kết hợp bằng chứng với sự thấu cảm',1,-1],
 ],
 Pentacles: [
 ['cơ hội,nền tảng','Một cơ hội thực tế có thể phát triển qua chăm sóc bền bỉ','Cơ hội chưa sẵn sàng hoặc thiếu chuẩn bị cần được xem lại','Kiểm tra nguồn lực và bắt đầu vừa sức',2,0],
 ['cân đối,linh hoạt','Bạn đang điều phối nhiều ưu tiên và nguồn lực','Quá tải hoặc thiếu cân đối khiến nhịp sống chao đảo','Xếp thứ tự ưu tiên và điều chỉnh ngân sách',1,-1],
 ['tay nghề,hợp tác','Sự phối hợp và kỹ năng bổ sung tạo ra chất lượng','Vai trò không rõ hoặc thiếu phối hợp làm giảm hiệu quả','Thống nhất trách nhiệm và tiêu chuẩn chung',2,-1],
 ['giữ gìn,an toàn','Nhu cầu an toàn khiến bạn muốn bảo vệ những gì đang có','Bạn có thể đang học buông kiểm soát hoặc chi tiêu thiếu giới hạn','Phân biệt tiết kiệm với nỗi sợ thiếu thốn',0,0],
 ['thiếu thốn,hỗ trợ','Cảm giác thiếu nguồn lực cần được đáp lại bằng hỗ trợ thực tế','Khả năng hồi phục xuất hiện khi bạn đón nhận trợ giúp','Tìm nguồn hỗ trợ và rà soát nhu cầu thiết yếu',-2,1],
 ['cho nhận,công bằng','Sự hỗ trợ cân bằng có thể giúp cả hai cùng ổn định','Cho nhận lệch hoặc trợ giúp kèm điều kiện cần được làm rõ','Thỏa thuận minh bạch trước khi nhận hay cho',2,-1],
 ['kiên nhẫn,đánh giá','Kết quả cần thời gian và một lần đánh giá tiến độ','Thiếu kiên nhẫn hoặc tiếp tục việc không hiệu quả làm hao nguồn lực','Đánh giá nỗ lực dựa trên kết quả thực tế',1,0],
 ['rèn luyện,chuyên tâm','Luyện tập đều đặn giúp kỹ năng và chất lượng tiến bộ','Làm việc máy móc hoặc cầu toàn khiến bạn mất động lực','Chọn một kỹ năng để cải thiện có chủ đích',2,0],
 ['độc lập,thành quả','Nỗ lực bền bỉ có thể đem lại sự tự chủ và tiện nghi','Vẻ ngoài đủ đầy có thể che sự phụ thuộc hoặc kiệt sức','Giữ cân bằng giữa thành quả và chất lượng sống',2,0],
 ['bền vững,gia sản','Nền tảng lâu dài được xây từ cam kết và nguồn lực chung','Khác biệt về giá trị hoặc trách nhiệm chung cần trao đổi','Lập kế hoạch lâu dài và làm rõ trách nhiệm',2,-1],
 ['học nghề,cơ hội','Một cơ hội học tập có thể tạo nền tảng thực tế','Thiếu tập trung hoặc chần chừ làm chậm việc học','Đặt một mục tiêu học tập có thể đo lường',1,0],
 ['bền bỉ,đều đặn','Tiến bộ chậm nhưng chắc đến từ thói quen đáng tin','Trì trệ hoặc quá cứng nhắc có thể làm bạn mất cơ hội','Giữ sự đều đặn và dành chỗ để điều chỉnh',1,0],
 ['chăm sóc,thực tế','Sự chu đáo và quản lý thực tế tạo cảm giác an toàn','Lo cho người khác quá nhiều có thể khiến bạn quên nhu cầu mình','Chăm sóc sức lực cùng với nguồn lực',2,0],
 ['ổn định,quản lý','Kinh nghiệm và trách nhiệm giúp xây nền tảng vững vàng','Đồng nhất giá trị bản thân với vật chất dễ tạo áp lực','Đánh giá sự đủ đầy bằng cả thời gian và quan hệ',2,-1],
 ],
};
const ranks=['Ace','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten','Page','Knight','Queen','King'];
const viRanks=['Át','Hai','Ba','Bốn','Năm','Sáu','Bảy','Tám','Chín','Mười','Tiểu Đồng','Kỵ Sĩ','Nữ Hoàng','Vua'];
const suits={Cups:['Cốc','cu'],Wands:['Gậy','wa'],Swords:['Kiếm','sw'],Pentacles:['Tiền','pe']};
function meanings(theme, advice, code, reversed=false) {
 const [love,career,finance]=topicLenses[code];
 const lead=reversed?'Điều cần nhìn lại là cách bạn đang ':'Một hướng chiêm nghiệm là ';
 return {general:theme+'.',love:`${theme}. ${lead}${love}.`,career:`${theme}. ${lead}${career}.`,finance:`${theme}. ${lead}${finance}. Đây không phải khuyến nghị đầu tư.`,advice:advice+'.'};
}
function makeCard(name,vietnameseName,arcana,suit,number,code,keywords,up,down,advice,yesUp,yesDown){
 return {id:code,slug:name.toLowerCase().replaceAll(' ','-'),name,vietnameseName,arcana,suit,number,image:`/cards-images/${code}.jpg`,keywords:keywords.split(','),upright:meanings(up,advice,code),reversed:meanings(down,`Chậm lại để xem xét: ${advice.charAt(0).toLowerCase()+advice.slice(1)}`,code,true),energy:{upright:yesUp,reversed:yesDown}};
}
export const tarotCards=[...major.map(([name,vi,keys,up,down,advice,a,b],i)=>makeCard(name,vi,'Major',null,i,`ar${String(i).padStart(2,'0')}`,keys,up,down,advice,a,b)),...Object.entries(minor).flatMap(([suit,rows])=>rows.map(([keys,up,down,advice,a,b],i)=>makeCard(`${ranks[i]} of ${suit}`,`${viRanks[i]} ${suits[suit][0]}`,'Minor',suit,i+1,`${suits[suit][1]}${String(i+1).padStart(2,'0')}`,keys,up,down,advice,a,b)))];
export const cardById=Object.fromEntries(tarotCards.map(c=>[c.id,c]));
