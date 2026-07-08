'use strict';

/**
 * Nội dung các trang CHÍNH SÁCH & FAQ của DECOR CAR.
 * Tách riêng khỏi route/template để dễ chỉnh sửa nội dung mà không đụng vào logic.
 *
 * Mỗi policy: { slug, title, tag, updated, intro, sections: [{ h, blocks }] }
 *  - blocks: mảng, mỗi phần tử là chuỗi (đoạn văn) hoặc { list: [...] } (danh sách gạch đầu dòng).
 */

const POLICIES = [
  {
    slug: 'giao-hang-lap-dat',
    title: 'Chính sách giao hàng & lắp đặt',
    tag: 'Giao nhận',
    updated: '2026-07-01',
    intro:
      'DECOR CAR giao hàng toàn quốc và hỗ trợ lắp đặt tận nơi tại các thành phố lớn. Chính sách dưới đây giúp bạn nắm rõ thời gian, phí và quy trình nhận hàng.',
    sections: [
      {
        h: 'Phạm vi & thời gian giao hàng',
        blocks: [
          'Chúng tôi giao hàng trên toàn quốc thông qua đội ngũ nội bộ (nội thành) và các đối tác vận chuyển uy tín (liên tỉnh).',
          {
            list: [
              'Nội thành TP.HCM & Hà Nội: 1 – 2 ngày làm việc.',
              'Các tỉnh/thành khác: 2 – 5 ngày làm việc tuỳ khu vực.',
              'Đơn có lắp đặt: sắp lịch theo khung giờ bạn chọn, thường trong 1 – 3 ngày kể từ khi xác nhận.',
            ],
          },
          'Thời gian trên tính từ khi đơn hàng được xác nhận thành công. Các dịp lễ, Tết hoặc thời tiết bất lợi có thể phát sinh chậm trễ — bộ phận CSKH sẽ chủ động thông báo.',
        ],
      },
      {
        h: 'Phí giao hàng',
        blocks: [
          {
            list: [
              'Miễn phí giao hàng cho đơn từ 2.000.000₫ tại nội thành các thành phố lớn.',
              'Đơn dưới mức trên: phí được tính theo trọng lượng và khu vực, hiển thị rõ trước khi bạn thanh toán.',
              'Sản phẩm cồng kềnh (thảm định hình, bộ ghế da) có thể phát sinh phụ phí vận chuyển liên tỉnh — nhân viên sẽ báo trước khi giao.',
            ],
          },
        ],
      },
      {
        h: 'Dịch vụ lắp đặt tận nơi',
        blocks: [
          'Với các sản phẩm cần kỹ thuật (bọc ghế da, ốp nội thất, đèn ambient, camera hành trình, màn hình…), DECOR CAR cung cấp dịch vụ lắp đặt tại nhà bạn hoặc tại gara đối tác.',
          {
            list: [
              'Kỹ thuật viên mang đầy đủ dụng cụ, thi công gọn gàng, hoàn trả hiện trạng xe sạch sẽ.',
              'Thời gian lắp đặt trung bình 30 phút – 3 giờ tuỳ hạng mục.',
              'Bạn được kiểm tra và nghiệm thu trước khi ký xác nhận hoàn thành.',
            ],
          },
        ],
      },
      {
        h: 'Kiểm tra khi nhận hàng',
        blocks: [
          'Vui lòng kiểm tra ngoại quan sản phẩm ngay khi nhận: đúng mẫu, đủ số lượng, không móp/rách bao bì. Nếu phát hiện sai sót, hãy từ chối nhận hoặc quay video mở hàng và liên hệ hotline trong vòng 48 giờ để được hỗ trợ đổi/trả nhanh nhất.',
        ],
      },
    ],
  },

  {
    slug: 'bao-hanh',
    title: 'Chính sách bảo hành',
    tag: 'Bảo hành',
    updated: '2026-07-01',
    intro:
      'Mọi sản phẩm tại DECOR CAR đều là hàng chính hãng, được bảo hành theo tiêu chuẩn nhà sản xuất và cam kết chất liệu thật từ cửa hàng.',
    sections: [
      {
        h: 'Thời hạn bảo hành',
        blocks: [
          {
            list: [
              'Đồ điện tử (camera hành trình, màn hình, đèn LED ambient): 12 tháng.',
              'Bọc ghế da, ốp nội thất, thảm lót định hình: 6 – 12 tháng tuỳ dòng sản phẩm.',
              'Phụ kiện nhỏ (tẩu sạc, nước hoa, gối tựa…): 1 – 6 tháng hoặc đổi mới trong 7 ngày nếu lỗi.',
            ],
          },
          'Thời hạn cụ thể được ghi trên phiếu bảo hành hoặc hoá đơn đi kèm mỗi đơn hàng.',
        ],
      },
      {
        h: 'Điều kiện bảo hành',
        blocks: [
          'Sản phẩm được bảo hành khi đáp ứng đồng thời các điều kiện sau:',
          {
            list: [
              'Còn trong thời hạn bảo hành và còn hoá đơn / phiếu bảo hành hợp lệ.',
              'Lỗi do nhà sản xuất: bong tróc, lỗi mạch, chập chờn, sai kỹ thuật khi lắp đặt bởi DECOR CAR.',
              'Tem bảo hành (nếu có) còn nguyên vẹn, không bị can thiệp sửa chữa bởi bên thứ ba.',
            ],
          },
        ],
      },
      {
        h: 'Trường hợp không áp dụng bảo hành',
        blocks: [
          {
            list: [
              'Hư hỏng do va đập, ngập nước, cháy nổ, sử dụng sai hướng dẫn.',
              'Hao mòn tự nhiên theo thời gian (phai màu nhẹ, sờn do sử dụng lâu dài).',
              'Tự ý tháo lắp, sửa chữa tại nơi khác khiến sản phẩm biến dạng/hư hại.',
            ],
          },
        ],
      },
      {
        h: 'Quy trình bảo hành',
        blocks: [
          'Liên hệ hotline hoặc Zalo của cửa hàng để mô tả lỗi và gửi hình ảnh/video. Chúng tôi sẽ hẹn lịch tiếp nhận tại cửa hàng, tận nơi hoặc qua vận chuyển. Thời gian xử lý bảo hành thường 3 – 10 ngày làm việc tuỳ hạng mục và linh kiện thay thế.',
        ],
      },
    ],
  },

  {
    slug: 'doi-tra',
    title: 'Chính sách đổi trả & hoàn tiền',
    tag: 'Đổi trả',
    updated: '2026-07-01',
    intro:
      'Chúng tôi mong bạn hài lòng với mỗi món đồ. Nếu sản phẩm chưa đúng như kỳ vọng vì lỗi từ phía cửa hàng, DECOR CAR hỗ trợ đổi trả minh bạch trong 7 ngày.',
    sections: [
      {
        h: 'Thời hạn & điều kiện đổi trả',
        blocks: [
          'Bạn có thể yêu cầu đổi hoặc trả hàng trong vòng 7 ngày kể từ ngày nhận, khi sản phẩm:',
          {
            list: [
              'Còn nguyên tem, nhãn, phụ kiện đi kèm và chưa qua lắp đặt/sử dụng (trừ trường hợp lỗi kỹ thuật).',
              'Còn hoá đơn hoặc mã đơn hàng để đối chiếu.',
              'Không thuộc nhóm hàng đặt may/định hình riêng theo dòng xe (xem mục dưới).',
            ],
          },
        ],
      },
      {
        h: 'Các trường hợp được đổi trả miễn phí',
        blocks: [
          {
            list: [
              'Sản phẩm bị lỗi kỹ thuật do nhà sản xuất.',
              'Giao sai mẫu, sai màu, sai kích thước so với đơn đặt.',
              'Sản phẩm hư hỏng, móp méo trong quá trình vận chuyển (có video mở hàng làm bằng chứng).',
            ],
          },
          'Với các trường hợp trên, DECOR CAR chịu toàn bộ chi phí đổi trả và vận chuyển hai chiều.',
        ],
      },
      {
        h: 'Hàng đặt riêng theo xe',
        blocks: [
          'Các sản phẩm đo ni – may/định hình theo đúng dòng xe của bạn (bọc ghế da, thảm định hình, ốp nội thất) chỉ được đổi trả khi có lỗi kỹ thuật, do đặc thù sản xuất riêng không thể bán lại cho khách khác. Chúng tôi luôn tư vấn kỹ và xác nhận thông số trước khi sản xuất.',
        ],
      },
      {
        h: 'Quy trình & thời gian hoàn tiền',
        blocks: [
          'Liên hệ hotline/Zalo để tạo yêu cầu, gửi hình ảnh và mã đơn. Sau khi cửa hàng nhận lại và kiểm tra sản phẩm:',
          {
            list: [
              'Đổi sản phẩm khác: xử lý trong 2 – 4 ngày làm việc.',
              'Hoàn tiền chuyển khoản: 3 – 7 ngày làm việc kể từ khi duyệt yêu cầu.',
              'Hoàn tiền cho đơn thanh toán online sẽ về đúng phương thức bạn đã dùng.',
            ],
          },
        ],
      },
    ],
  },

  {
    slug: 'huong-dan-mua-hang',
    title: 'Hướng dẫn đặt hàng & thanh toán',
    tag: 'Mua hàng',
    updated: '2026-07-01',
    intro:
      'Đặt hàng tại DECOR CAR chỉ mất vài phút. Dưới đây là các bước và những phương thức thanh toán chúng tôi hỗ trợ.',
    sections: [
      {
        h: 'Các bước đặt hàng',
        blocks: [
          {
            list: [
              'Bước 1: Chọn sản phẩm — dùng bộ lọc “Tìm đồ theo dòng xe” để ra đúng món hợp xe bạn.',
              'Bước 2: Thêm vào giỏ và kiểm tra số lượng, áp mã giảm giá (nếu có).',
              'Bước 3: Điền thông tin nhận hàng và chọn phương thức thanh toán.',
              'Bước 4: Xác nhận đơn — bạn nhận mã đơn dạng DCxxxxxx để theo dõi trong mục Tài khoản.',
            ],
          },
        ],
      },
      {
        h: 'Phương thức thanh toán',
        blocks: [
          {
            list: [
              'COD — thanh toán khi nhận hàng: kiểm tra hàng rồi mới trả tiền cho nhân viên giao/lắp.',
              'Chuyển khoản ngân hàng: chuyển tới tài khoản cửa hàng theo thông tin hiển thị ở bước thanh toán, nội dung ghi mã đơn hàng.',
            ],
          },
          'DECOR CAR đang hoàn thiện tích hợp ví điện tử và cổng thanh toán trực tuyến (VNPay/Momo) để bạn có thêm lựa chọn trong thời gian tới.',
        ],
      },
      {
        h: 'Mã giảm giá',
        blocks: [
          'Nhập mã giảm giá tại trang giỏ hàng trước khi thanh toán. Mỗi mã có điều kiện áp dụng riêng (giá trị đơn tối thiểu, thời hạn). Đăng ký nhận bản tin ở cuối trang để lấy mã ưu đãi cho đơn đầu tiên.',
        ],
      },
      {
        h: 'Theo dõi đơn hàng',
        blocks: [
          'Đăng nhập tài khoản để xem trạng thái đơn: Chờ xác nhận → Đã xác nhận → Đang giao → Hoàn thành. Bạn cũng có thể gọi hotline kèm mã đơn để được cập nhật nhanh.',
        ],
      },
    ],
  },

  {
    slug: 'bao-mat',
    title: 'Chính sách bảo mật',
    tag: 'Bảo mật',
    updated: '2026-07-01',
    intro:
      'DECOR CAR tôn trọng và cam kết bảo vệ thông tin cá nhân của khách hàng. Chính sách này giải thích chúng tôi thu thập, sử dụng và bảo vệ dữ liệu của bạn như thế nào.',
    sections: [
      {
        h: 'Thông tin chúng tôi thu thập',
        blocks: [
          {
            list: [
              'Thông tin liên hệ & giao hàng: họ tên, số điện thoại, email, địa chỉ.',
              'Thông tin đơn hàng: sản phẩm đã mua, dòng xe, phương thức thanh toán.',
              'Thông tin kỹ thuật cơ bản khi bạn truy cập website (để vận hành và cải thiện trải nghiệm).',
            ],
          },
        ],
      },
      {
        h: 'Mục đích sử dụng',
        blocks: [
          {
            list: [
              'Xử lý và giao đơn hàng, hỗ trợ lắp đặt và bảo hành.',
              'Chăm sóc khách hàng, giải quyết khiếu nại và yêu cầu đổi trả.',
              'Gửi thông tin ưu đãi khi bạn đồng ý nhận bản tin (có thể huỷ bất cứ lúc nào).',
            ],
          },
        ],
      },
      {
        h: 'Bảo vệ & chia sẻ dữ liệu',
        blocks: [
          'Thông tin của bạn được lưu trữ an toàn và chỉ được chia sẻ với đơn vị vận chuyển/lắp đặt ở mức tối thiểu cần thiết để hoàn thành đơn hàng. Chúng tôi không mua bán dữ liệu khách hàng cho bên thứ ba vì mục đích thương mại.',
        ],
      },
      {
        h: 'Quyền của bạn',
        blocks: [
          'Bạn có quyền yêu cầu xem, chỉnh sửa hoặc xoá thông tin cá nhân của mình. Vui lòng liên hệ hotline hoặc email của cửa hàng để được hỗ trợ.',
        ],
      },
    ],
  },

  {
    slug: 'dieu-khoan',
    title: 'Điều khoản sử dụng',
    tag: 'Điều khoản',
    updated: '2026-07-01',
    intro:
      'Khi truy cập và mua hàng tại website DECOR CAR, bạn đồng ý với các điều khoản dưới đây. Vui lòng đọc kỹ trước khi sử dụng.',
    sections: [
      {
        h: 'Sử dụng website',
        blocks: [
          'Website DECOR CAR phục vụ mục đích giới thiệu và bán sản phẩm nội thất, phụ kiện trang trí xe hơi. Bạn cam kết không sử dụng website vào mục đích vi phạm pháp luật, phá hoại hệ thống hoặc xâm phạm quyền lợi của cửa hàng và khách hàng khác.',
        ],
      },
      {
        h: 'Thông tin sản phẩm & giá',
        blocks: [
          'Chúng tôi nỗ lực mô tả sản phẩm và niêm yết giá chính xác nhất. Hình ảnh mang tính minh hoạ; màu sắc thực tế có thể chênh lệch nhẹ do màn hình hiển thị. Giá có thể thay đổi theo chương trình khuyến mãi và sẽ được cập nhật công khai trên website.',
        ],
      },
      {
        h: 'Đặt hàng & xác nhận',
        blocks: [
          'Một đơn hàng chỉ có hiệu lực sau khi được cửa hàng xác nhận. DECOR CAR có quyền từ chối hoặc huỷ đơn trong trường hợp hết hàng, thông tin không hợp lệ hoặc nghi ngờ gian lận, và sẽ thông báo cho bạn kèm phương án xử lý.',
        ],
      },
      {
        h: 'Sở hữu trí tuệ',
        blocks: [
          'Toàn bộ nội dung, thương hiệu và thiết kế trên website thuộc quyền sở hữu của DECOR CAR, trừ các hình ảnh minh hoạ có nguồn gốc bên thứ ba. Không sao chép, sử dụng lại vì mục đích thương mại khi chưa có sự đồng ý bằng văn bản.',
        ],
      },
    ],
  },
];

const FAQS = [
  {
    q: 'Làm sao biết sản phẩm có hợp với dòng xe của tôi không?',
    a: 'Dùng bộ lọc “Tìm đồ theo dòng xe” ở trang chủ hoặc trang cửa hàng — chọn hãng xe để lọc ra sản phẩm phù hợp. Các phụ kiện dùng chung sẽ hợp mọi xe; món đo ni theo xe (bọc ghế, thảm định hình, ốp nội thất) sẽ hiển thị hãng tương thích ngay trong phần thông số sản phẩm. Nếu chưa chắc, hãy nhắn hotline/Zalo kèm dòng xe để được tư vấn.',
  },
  {
    q: 'DECOR CAR có lắp đặt tận nơi không?',
    a: 'Có. Với các sản phẩm cần kỹ thuật (bọc ghế, ốp nội thất, đèn ambient, camera, màn hình…), chúng tôi hỗ trợ lắp đặt tại nhà bạn hoặc tại gara đối tác ở các thành phố lớn. Bạn có thể chọn khung giờ khi đặt hàng.',
  },
  {
    q: 'Tôi có được kiểm tra hàng trước khi thanh toán không?',
    a: 'Với đơn COD, bạn kiểm tra ngoại quan và số lượng sản phẩm trước khi trả tiền cho nhân viên giao/lắp. Nếu sai sót, bạn có quyền từ chối nhận.',
  },
  {
    q: 'Thời gian bảo hành là bao lâu?',
    a: 'Tuỳ nhóm sản phẩm: đồ điện tử thường 12 tháng, đồ nội thất 6 – 12 tháng, phụ kiện nhỏ 1 – 6 tháng. Thời hạn cụ thể ghi trên phiếu bảo hành/hoá đơn. Xem chi tiết ở trang Chính sách bảo hành.',
  },
  {
    q: 'Sản phẩm đặt may theo xe có được đổi trả không?',
    a: 'Hàng đo ni – may/định hình riêng theo dòng xe chỉ đổi trả khi có lỗi kỹ thuật, do không thể bán lại cho khách khác. Chúng tôi luôn xác nhận kỹ thông số trước khi sản xuất để tránh sai sót.',
  },
  {
    q: 'Có những hình thức thanh toán nào?',
    a: 'Hiện tại hỗ trợ COD (thanh toán khi nhận hàng) và chuyển khoản ngân hàng. Cổng thanh toán trực tuyến VNPay/Momo đang được hoàn thiện và sẽ sớm ra mắt.',
  },
  {
    q: 'Làm sao để nhận mã giảm giá?',
    a: 'Đăng ký nhận bản tin ở cuối trang để lấy mã giảm 10% cho đơn đầu tiên. Ngoài ra cửa hàng thường xuyên có mã ưu đãi theo giá trị đơn — nhập mã tại trang giỏ hàng trước khi thanh toán.',
  },
];

function policyBySlug(slug) {
  return POLICIES.find((p) => p.slug === slug) || null;
}

module.exports = { POLICIES, FAQS, policyBySlug };
