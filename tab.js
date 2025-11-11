// 画面に設定されたグループ単位でタブ化します。
// グループに設定されたフィールド名がタブ名になります。
// グループ名に「hidden」を含めると非表示
(function() {
  'use strict';

  var tabDefaultCSS  = 'vertical-tabs';
  var tabSelectedCSS = 'vertical-tab-selected';
  
  // タブを表示する要素を返す
  var getTabContainer = function() {
    var tabContainer = document.getElementById('vertical-tab-container');
    if (tabContainer === null) {
      // タブを格納する要素取得して、タブ表示に必要なclassを追加
      var recordGaia = document.getElementById('record-gaia');
      // タブを表示する要素を作成
      var tabContainerWrapper = document.createElement('div');
      tabContainerWrapper.id = 'vertical-tab-container-wrapper';
      recordGaia.prepend(tabContainerWrapper);
      // コンテナを2層化
      tabContainer = document.createElement('div');
      tabContainer.id = 'vertical-tab-container';
      tabContainerWrapper.prepend(tabContainer);
    }
    return tabContainer;
  };
  
  // タブ（button）を作成
  var addTab = function(groupNo, groupName) {
    // タブをボタンで作成
    var tabElement = document.createElement('button');
    tabElement.innerHTML = groupName;
    tabElement.classList.add(tabDefaultCSS);
    tabElement.dataset.tabContainer = groupNo;
    // タブをクリックされた時のイベント登録
    tabElement.addEventListener('click', function(){
      // タブ表示をリセット
      var elements;
      elements = document.querySelectorAll('.'+tabDefaultCSS);
      elements.forEach(function(element){
        element.classList.remove(tabSelectedCSS);
      });
      this.classList.add(tabSelectedCSS);
      // グループ表示をリセット
      elements = document.querySelectorAll('.vertical-tab-container');
      elements.forEach(function(element){
        element.classList.add('vertical-tab-container-hidden');
      });
      var element = document.querySelector('.vertical-tab-container[data-tab-container="'+groupNo+'"]');
      element.classList.remove('vertical-tab-container-hidden');
    });
    return tabElement;
  };
  
  // 登録、編集、詳細画面
  kintone.events.on(['app.record.create.show','app.record.edit.show','app.record.detail.show'], function (event) {
    
    // タブを表示する要素を取得
    var tabContainer = getTabContainer();

    // グループを探してタブを作成する
    var groupLabels = document.querySelectorAll('.group-label-gaia');
    groupLabels.forEach(function(groupLabel, groupNo){
      var groupName = groupLabel.innerText;
      var groupElement = groupLabel.parentElement;
      var groupContainer = groupElement.parentElement;
      groupElement.classList.remove('control-group-gaia-collapsed');
      groupElement.classList.add('control-group-gaia-expanded', 'border-less-group');
      groupContainer.classList.add('vertical-tab-container', 'vertical-tab-container-hidden');
      groupContainer.dataset.tabContainer = groupNo;

      var tabElement = document.querySelector('button[data-tab-container="'+groupNo+'"]');
      if (tabElement === null) {
        // タブを作成
        tabElement = addTab(groupNo, groupName);
        // タブを表示スペースに追加
        tabContainer.appendChild(tabElement);
      }
      // グループ名に「hidden」が含まれていたらタブ毎非表示
      if (groupName.includes('hidden')) {
        tabElement.style.display = 'none';
      }
    });

    // 選択状態のタブを取得
    var selectedTab = document.querySelector('.'+tabSelectedCSS);
    if (selectedTab === null) {
      selectedTab = document.querySelector('.'+tabDefaultCSS);
      selectedTab.classList.add(tabSelectedCSS);
    }
    selectedTab.click();

    // タブ化するまで非表示にしていたものを表示
    var recordGaia = document.getElementById('record-gaia');
    recordGaia.classList.add('show');
    
    return event;  
  });
  
})();