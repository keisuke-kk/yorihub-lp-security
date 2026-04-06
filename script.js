/**
 * ヨリハブ LP JavaScript
 * FAQアコーディオン機能 & ユーティリティ
 */

(function () {
  'use strict';

  // ----- DOM読み込み完了後に初期化 -----
  document.addEventListener('DOMContentLoaded', function () {
    initFaqAccordion();
    initSmoothScroll();
    initFixedCtaBar();
  });

  /**
   * FAQアコーディオン機能の初期化
   * ボタンクリックで開閉、aria-expanded属性の切り替え
   */
  function initFaqAccordion() {
    // FAQの質問ボタンをすべて取得
    var faqButtons = document.querySelectorAll('.faq-question');

    faqButtons.forEach(function (button) {
      // クリックイベントを設定
      button.addEventListener('click', function () {
        toggleFaqItem(this);
      });

      // キーボード操作（Enter/Space）対応
      button.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleFaqItem(this);
        }
      });
    });
  }

  /**
   * FAQアイテムの開閉を切り替え
   * @param {HTMLElement} button - クリックされたボタン要素
   */
  function toggleFaqItem(button) {
    // 現在の状態を取得
    var isExpanded = button.getAttribute('aria-expanded') === 'true';

    // aria-expanded属性を切り替え
    button.setAttribute('aria-expanded', !isExpanded);

    // 対応する回答要素を取得
    var answerId = button.getAttribute('aria-controls');
    var answer = document.getElementById(answerId);

    if (answer) {
      // 開閉状態を切り替え
      if (isExpanded) {
        answer.classList.remove('is-open');
      } else {
        answer.classList.add('is-open');
      }
    }
  }

  /**
   * スムーズスクロール機能（アンカーリンク用）
   * ページ内リンククリック時にスムーズにスクロール
   */
  function initSmoothScroll() {
    // ページ内リンク（#で始まるhref）を取得
    var anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach(function (link) {
      link.addEventListener('click', function (e) {
        var href = this.getAttribute('href');

        // #のみの場合はスキップ
        if (href === '#') return;

        var target = document.querySelector(href);

        if (target) {
          e.preventDefault();

          // ヘッダーの高さを考慮したスクロール位置
          var headerHeight = document.querySelector('.header').offsetHeight;
          var targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });

          // フォーカスを移動（アクセシビリティ対応）
          target.setAttribute('tabindex', '-1');
          target.focus();
        }
      });
    });
  }

  /**
   * 固定CTAバーのスクロール表示機能
   * 一定量スクロールしたら表示する
   */
  function initFixedCtaBar() {
    var fixedCta = document.getElementById('fixedCta');
    if (!fixedCta) return;

    // 表示開始のスクロール量（px）
    var showThreshold = 150;
    // 最下部付近で非表示にするか（フッターと重なる対策）
    var hideNearBottom = true;
    var bottomOffset = 200;

    var isVisible = false;
    var ticking = false;

    function updateCtaVisibility() {
      var scrollY = window.pageYOffset || document.documentElement.scrollTop;
      var windowHeight = window.innerHeight;
      var documentHeight = document.documentElement.scrollHeight;

      // 最下部付近かどうか
      var isNearBottom = hideNearBottom && (scrollY + windowHeight >= documentHeight - bottomOffset);

      // 表示条件: スクロール量が閾値以上 かつ 最下部付近でない
      var shouldShow = scrollY > showThreshold && !isNearBottom;

      if (shouldShow && !isVisible) {
        fixedCta.classList.add('is-visible');
        isVisible = true;
      } else if (!shouldShow && isVisible) {
        fixedCta.classList.remove('is-visible');
        isVisible = false;
      }

      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(updateCtaVisibility);
        ticking = true;
      }
    }

    // スクロールイベントを登録
    window.addEventListener('scroll', onScroll, { passive: true });

    // 初期状態をチェック（ページ途中からのリロード対応）
    updateCtaVisibility();
  }

  /**
   * 電話番号タップ時のGoogleアナリティクス等のトラッキング用
   * 必要に応じてトラッキングコードを追加
   */
  function trackPhoneClick() {
    // 電話リンクを取得
    var phoneLinks = document.querySelectorAll('a[href^="tel:"]');

    phoneLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        // ここにトラッキングコードを追加
        // 例: gtag('event', 'click', { 'event_category': 'phone', 'event_label': 'CTA' });
        console.log('電話CTAがクリックされました');
      });
    });
  }

  // 電話トラッキングを初期化（必要に応じて有効化）
  // trackPhoneClick();

})();
