import { paginationConfig } from "./paginationConfig.js";

const loadLastInfo = () => {
  return sessionStorage.getItem("currentLanguage")
    ? sessionStorage.getItem("currentLanguage")
    : "zh-cn"; // 默认语言
};

// let currentLanguage = loadLastInfo(); // 默认语言
// 渲染分页
export const renderPagination = (config) => {
  //   currentLanguage = loadLastInfo();
  const { currentPage, totalPages, maxVisiblePages } = config;
  const paginationContainer = document.getElementById("pagination");
  paginationContainer.innerHTML = ""; // 清空内容

  // 计算可见的页码
  const half = Math.floor(maxVisiblePages / 2);
  let start = Math.max(1, currentPage - half);
  let end = Math.min(totalPages, currentPage + half);

  if (totalPages <= maxVisiblePages) {
    start = 1;
    end = totalPages;
  } else {
    if (start <= 2) {
      start = 1;
      end = Math.min(maxVisiblePages, totalPages);
    }
    if (end >= totalPages - 1) {
      start = Math.max(1, totalPages - maxVisiblePages + 1);
      end = totalPages;
    }
  }

  const visiblePages = Array.from(
    { length: end - start + 1 },
    (_, i) => start + i
  );

  // 判断是否需要显示省略号
  const showLeftEllipsis = totalPages > maxVisiblePages && visiblePages[0] > 2;
  const showRightEllipsis =
    totalPages > maxVisiblePages && visiblePages.at(-1) < totalPages - 1;

  // 创建 "上一页" 按钮
  const prevButton = createButton(
    // translations[currentLanguage].home.paginationText.prev,
    "上一页",
    currentPage > 1,
    () => goToPage(currentPage - 1)
  );
  paginationContainer.appendChild(prevButton);

  // 创建左侧省略号
  if (showLeftEllipsis) {
    const leftEllipsis = createEllipsis();
    paginationContainer.appendChild(leftEllipsis);
  }

  // 创建页码按钮
  visiblePages.forEach((page) => {
    const pageButton = createButton(
      page,
      true,
      () => goToPage(page),
      page === currentPage
    );
    paginationContainer.appendChild(pageButton);
  });

  // 创建右侧省略号
  if (showRightEllipsis) {
    const rightEllipsis = createEllipsis();
    paginationContainer.appendChild(rightEllipsis);
  }

  // 创建 "下一页" 按钮
  const nextButton = createButton(
    // translations[currentLanguage].home.paginationText.next,
    "下一页",
    currentPage < totalPages,
    () => goToPage(currentPage + 1)
  );
  paginationContainer.appendChild(nextButton);
};

// 创建按钮
export const createButton = (label, enabled, onClick, isActive = false) => {
  const button = document.createElement("button");
  button.textContent = label;
  button.className = "pagination-item";
  if (!enabled) {
    button.disabled = true;
  }
  if (isActive) {
    button.classList.add("active");
  }
  if (enabled) {
    button.addEventListener("click", onClick);
  }
  return button;
};

// 创建省略号
export const createEllipsis = () => {
  const ellipsis = document.createElement("button");
  ellipsis.textContent = "...";
  ellipsis.className = "pagination-ellipsis";
  ellipsis.disabled = true;
  return ellipsis;
};

// 切换页码
export const goToPage = (page) => {
  console.log(page);
  paginationConfig.currentPage = page;
  renderPagination(paginationConfig); // 重新渲染分页
};
