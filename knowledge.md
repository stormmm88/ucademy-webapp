
# Common

- Metadata là những thông tin của trang web, thường là để tối ưu cho việc SEO.
- title: Tiêu đề của trang web 
- description: Mô tả của trang web.

# Next/font
- Google font
- Font weight
- Subset
- Variables
- Multiple fonts
- Local fonts
- Tailwind fonts
- Import: import {Manrope, Roboto} from "next/font/google"
- Khai báo: const manrope = Manrope({ subsets: ["latin"] })
- weight: font weight của chữ điền vào là chuỗi weight: "400" hoặc là mảng weight: ["400", "500", "600"]
- subsets: kiểu chữ, thông thường là latin 
- variable: tên biến để sử dùng trong CSS, ví dụ: variable: "--font-manrope"
- sử dụng trong CSS: body{font-family: var(--font-manrope)}
- tailwindCSS: <h1 className="font-primary">Tiêu đề</h1>

``` ts
theme: { 
    extend: {
        fontFamily: {
            primary: ["var(--font-manrope)", "sans-serif"],
            secondary: ["var(--font-geist-sans)", "sans-serif"],
            mono: ["var(--font-geist-mono)", "monospace"]
        },
    }, 
  },
```

- local fonts

- import localFont from "next/font/local";

```ts
const arial = localFont({
    src: "" | [
        {
            path: "",
            weight: "500",
            style: "italic",
        },
    ],
    display: "swap",
})
```

# Kiến thức
- Nếu mà component có tính lặp thì nên lưa vào 1 mảng rồi sau đó loop ra  thì sẽ tối ưu.


# TypeScipt 
- `ComponentProps<"svg">`: lấy ra các thuộc tính của thẻ svg

# Next/Link
- Link
- href: đường dẫn, có thể trường vào là chuỗi hoặc object
```js
<Link
    href={{
        pathname: url,
        query: {slug: "bai-1-tong-quan"}
    }}
></Link>
```
- replace: thay thế đường dẫn và không lưu lại lịch sử ( nghĩa là không back về trang trước đó được)
- scroll: mặc định là `true` nghĩa là khi nhấn vào link thì sẽ scroll lên trên cùng , nếu không muốn scroll thì thiết lập `scroll={false}`
- prefetch: giúp những dữ liệu ít thay đổi (trong trang tĩnh) sẽ chạy trước trong nền.
- hook `usePathname()` trả ra pathname giúp chúng ta xử lý trong những trường hợp mà chúng ta muốn ví dụ như là active link

# Error
- You're importing a component that needs `usePathname`. This React Hook only works in a Client Component. To fix, mark the file (or its parent) with the `"use client"` directive: lỗi này là khi sử dụng các hook ở phía client trong khi đang sử dụng Server Component, 
để khắc phục thì thêm `"use client"` lên trên cùng của file.

# Routing 
- Basic: Thư mục có file page.tsx -> sign-in: page.tsx. Sẽ tạo ra đường dẫn của webapp là /sign-in.
- Lưu ý: trong thư mục phải có file `page.tsx`

- Segment dynamic: [name] -> [course]: lấy các params ra để xử lý một công việc gì đó ví dụ như lấy bài học từ khóa học 
thì mình sẽ có cấu trúc: [course]/lesson/page.tsx
```js
[course]/lesson/page.tsx
vscode-master/lesson?slug=bai-1-tong-quan
```

- Nested Routes
```js
/hello/world/page.tsx
/hello/world
- hello là segment 1
- world là segment 2
```

- Group: sẽ không tạo ra routing, ví dụ `(dashboard)` sẽ không tạo ra /dashboard. Nếu truy cập vào thì sẽ hiển thị not-found.
Mục đích sử dụng là để gom các routing liên quan vào chung 

- Ví dụ có đường dẫn là /shop, /shop/a, /shop/b, /shop/a/b thì _Catch-all Segments_ sẽ chấp nhận /shop/a, /shop/b, /shop/a/b
còn nếu vào /shop thì sẽ not-found.
Ví dụ có đường dẫn là /shop, /shop/a, /shop/b, /shop/a/b thì _Optional Catch-all Segments_ sẽ chấp nhận tất cả bao gồm /shop,
/shop/a, /shop/b, /shop/a/b.

- Catch-all Segments: sign-in/[...sign-in]
- Optional Catch-all Segments: sign-in/[[...sign-in]]


- Parallel Routes 
- Intercepting Routes
- Lưu ý: khi để 2 thư mục dynamic cùng cấp sẽ báo lỗi. Ví dụ [item] cùng cấp với [folder].

# Params

- Params: thường là dynamic routes: [item]/lesson. Ví dụ:  /html-css/lesson?slug=tong-quan thì _html-css_ chính là `params`
- Search Params: thường là những query trên URL. Ví dụ: lesson?slug=html-css thì _slug_ chính là `searchParams`

# Layout
- Định nghĩa: là 1 cái sườn của 1 web, để chia cấu trúc. Ví dụ: trang dashboard thì sẽ có bên trái là side bar (luôn giữ nguyên) còn bên phải là nội dung (sẽ thay đổi theo những thao tác bên side bar)

# Next/Image
- Image yêu cầu có 3 thuộc tính bắt buộc là `alt`, `width`, `height`.
- Nếu sử dụng thuộc tính `fill` thì không cần `width` và `height`, `Image` vẫn hoạt động. Tuy nhiên thẻ `img` sẽ trở thành `absolute`.
cho nên cần có 1 phần tử chứa nó sử dụng position: `relative` hoặc `absolute` tùy vào mục đích code.
- khi sử dụng `src` từ bên ngoài thì phải thiết lập next.config.ts
```ts
images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },  
    ],
  },
```