/**
 * File Name : main.js  
 * Date Created : 2020.02.18
 * Writer  : 박동혁
 * Description : main.html에서 발생하는 이벤트 처리를 위한 JavaScript
**/

// document.ready 영역 시작

this.ccvm_instance = new CloudCenterVirtualMachine()
ccvm_instance = this.ccvm_instance
$(document).ccvm_instance = ccvm_instance
pluginpath = '/usr/share/cockpit/ablestack'

$(document).ready(function(){
    $('#dropdown-menu-storage-cluster-status').hide();
    $('#dropdown-menu-cloud-cluster-status').hide();
    $('#dropdown-menu-storage-vm-status').hide();
    $('#dropdown-menu-cloud-vm-status').hide();

    $('#button-open-modal-wizard-storage-cluster').hide()
    $('#button-open-modal-wizard-storage-vm').hide()
    $('#button-open-modal-wizard-cloud-vm').hide()
    $('#button-link-storage-center-dashboard').hide()
    $('#button-link-cloud-center').hide()
    $('#button-link-monitoring-center').hide()

    $('#div-modal-wizard-storage-vm').load("./src/features/storage-vm-wizard.html");
    $('#div-modal-wizard-storage-vm').hide();

    $('#div-modal-wizard-cluster-config-prepare').load("./src/features/cluster-config-prepare.html");
    $('#div-modal-wizard-cluster-config-prepare').hide();

    $('#div-modal-wizard-cloud-vm').load("./src/features/cloud-vm-wizard.html");
    $('#div-modal-wizard-cloud-vm').hide();

    $('#dev-modal-migration-cloud-vm').hide();
    $('#dev-modal-stop-cloud-vm').hide();

    $('#div-change-modal-cloud-vm').load("./src/features/cloud-vm-change.html");
    $('#div-change-modal-cloud-vm').hide();
    $('#div-change-alert-cloud-vm').load("./src/features/cloud-vm-change-alert.html");
    $('#div-change-alert-cloud-vm').hide();
    
    // 스토리지 센터 가상머신 자원변경 페이지 로드
    $('#div-modal-storage-vm-resource-update').load("./src/features/storage-vm-resource-update.html");
    $('#div-modal-storage-vm-resource-update').hide();    
    // 스토리지 센터 가상머신 상태변경 페이지 로드
    $('#div-modal-storage-vm-status-update').load("./src/features/storage-vm-status-update.html");
    $('#div-modal-storage-vm-status-update').hide();
    // 스토리지 클러스터 유지보수 모드 변경 페이지 로드
    $('#div-modal-storage-cluster-maintenance-update').load("./src/features/storage-cluster-maintenance-update.html");
    $('#div-modal-storage-cluster-maintenance-update').hide();

    // 배포상태 조회(비동기)완료 후 배포상태에 따른 요약리본 UI 설정
    Promise.all([checkConfigStatus(), checkStorageClusterStatus(), 
        checkStorageVmStatus(), CardCloudClusterStatus(), new CloudCenterVirtualMachine().checkCCVM()]).then(function(){
            checkDeployStatus();
        });
        
});
// document.ready 영역 끝

// 이벤트 처리 함수
$('#card-action-storage-cluster-status').on('click', function(){
    $('#dropdown-menu-storage-cluster-status').toggle();
});

$('#card-action-cloud-cluster-status').on('click', function(){    
    $('#dropdown-menu-cloud-cluster-status').toggle();
});

$('#card-action-storage-vm-status').on('click', function(){
    $('#dropdown-menu-storage-vm-status').toggle();
});

$('#card-action-cloud-vm-status').on('click', function(){
    $('#dropdown-menu-cloud-vm-status').toggle();
});

var cpu=0;
var memory=0;
$('#card-action-cloud-vm-change').on('click', function(){
    ccvm_instance.createChangeModal();
});

$('#card-action-cloud-vm-connect').on('click', function(){
    // 클라우드센터VM 연결
    window.open('http://' + ccvm_instance.ip + ":9090");
});

$('#button-open-modal-wizard-storage-vm').on('click', function(){
    $('#div-modal-wizard-storage-vm').show();
});

$('#button-open-modal-wizard-storage-cluster').on('click', function(){
    $('#div-modal-wizard-cluster-config-prepare').show();
});

$('#button-open-modal-wizard-cloud-vm').on('click', function(){
    $('#div-modal-wizard-cloud-vm').show();
});

$('#button-link-storage-center-dashboard').on('click', function(){
    const mgr = sessionStorage.getItem("mgr");
    const mgr_ip = sessionStorage.getItem(mgr+'-mngt');
    if(mgr==undefined||mgr==""){
        // storageCenter url 링크 주소 가져오기
        cockpit.spawn(["python3", "/usr/share/cockpit/ablestack/python/url/create_address.py", "storageCenter", "-H"])
        .then(function(data){
            var retVal = JSON.parse(data);        
            if(retVal.code == 200){
                // 스토리지센터 연결
                window.open(retVal.val);
            }
        })
        .catch(function(data){
            // console.log(":::Error:::");        
        });
    }else{
        window.open('https://'+mgr_ip+':8443');
    }
});

$('#button-link-cloud-center').on('click', function(){
    // 클라우드센터 연결
    cockpit.spawn(["python3", "/usr/share/cockpit/ablestack/python/url/create_address.py", "cloudCenter"])
    .then(function(data){
        var retVal = JSON.parse(data);        
        if(retVal.code == 200){
            window.open(retVal.val);
        }
    })
    .catch(function(data){
        //console.log(":::Error:::");        
    });
});

// 스토리지센터 클러스터 유지보수모드 설정 버튼 클릭시 modal의 설명 세팅
$('#menu-item-set-maintenance-mode').on('click',function(){
    $('#modal-description-maintenance-status').html("<p>스토리지 클러스터를 유지보수 모드를 '설정' 하시겠습니까?</p>");
    $('#scc-maintenance-update-cmd').val("set");
    $('#div-modal-storage-cluster-maintenance-update').show();
});

// 스토리지센터 클러스터 유지보수모드 해제 버튼 클릭시 modal의 설명 세팅
$('#menu-item-unset-maintenance-mode').on('click',function(){
    $('#modal-description-maintenance-status').html("<p>스토리지 클러스터를 유지보수 모드를 '해제' 하시겠습니까?</p>");
    $('#scc-maintenance-update-cmd').val("unset");
    $('#div-modal-storage-cluster-maintenance-update').show();  
});

// 스토리지센터 VM 시작 버튼 클릭시 modal의 설명 세팅
$('#menu-item-set-storage-center-vm-start').on('click',function(){
    $('#modal-title-scvm-status').text("스토리지 센터 가상머신 상태 변경");
    $('#modal-description-scvm-status').html("<p>스토리지 센터 가상머신을 '시작' 하시겠습니까?</p>");
    $('#button-storage-vm-status-update').html("시작");
    $('#scvm-status-update-cmd').val("start");
    $('#div-modal-storage-vm-status-update').show();
});

// 스토리지센터 VM 정지 버튼 클릭시 modal의 설명 세팅
$('#menu-item-set-storage-center-vm-stop').on('click',function(){
    $('#modal-title-scvm-status').text("스토리지 센터 가상머신 상태 변경");
    $('#modal-description-scvm-status').html("<p>스토리지 센터 가상머신을 '정지' 하시겠습니까?</p>");
    $('#button-storage-vm-status-update').html("정지");
    $('#scvm-status-update-cmd').val("stop");
    $('#div-modal-storage-vm-status-update').show();
});

// 스토리지센터 VM 삭제 버튼 클릭시 modal의 설명 세팅
$('#menu-item-set-storage-center-vm-delete').on('click',function(){
    $('#modal-title-scvm-status').text("스토리지 센터 가상머신 상태 변경");
    $('#modal-description-scvm-status').html("<p>스토리지 센터 가상머신을 '삭제' 하시겠습니까?</p>");
    $('#button-storage-vm-status-update').html("삭제");
    $('#scvm-status-update-cmd').val("delete");
    $('#div-modal-storage-vm-status-update').show();    
});

// 스토리지센터 VM 자원변경 버튼 클릭시 modal의 설명 세팅
$('#menu-item-set-storage-center-vm-resource-update').on('click', function(){    
    //현재 cpu, memory 값은 선택이 되지 않도록 disabled
    $("#form-select-storage-vm-cpu-update option[value="+ sessionStorage.getItem("scvm_cpu") +"]").prop('disabled',true);
    $("#form-select-storage-vm-memory-update option[value="+ sessionStorage.getItem("scvm_momory").split(' ')[0] +"]").prop('disabled',true);    
    $('#div-modal-storage-vm-resource-update').show();
});

/**
 * Meathod Name : bootstrap_run_check  
 * Date Created : 2021.04.10
 * Writer  : 최진성
 * Description : scvm /root/bootstrap.sh  파일 실행
 * Parameter : 없음
 * Return  : 없음
 * History  : 2021.04.10 최초 작성
 */
 function bootstrap_run(){
    $('#modal-title-scvm-status').text("스토리지 센터 가상머신 Bootstrap 실행");
    $('#modal-description-scvm-status').html("<p>스토리지 센터 가상머신의 Bootstrap.sh 파일을 실행 하시겠습니까??</p>");
    $('#button-storage-vm-status-update').html("실행");
    $('#scvm-status-update-cmd').val("bootstrap");
    $('#div-modal-storage-vm-status-update').show();
}
/**
 * Meathod Name : scc_link_go
 * Date Created : 2021.04.10
 * Writer  : 최진성
 * Description : 스토리지센터 연결 버튼 클릭시 URL 세팅
 * Parameter : 없음
 * Return  : 없음
 * History  : 2021.04.10 최초 작성
 */
function scc_link_go(){
    const mgr = sessionStorage.getItem("mgr");
    const mgr_ip = sessionStorage.getItem(mgr+'-mngt');
    if(mgr==undefined||mgr==""){
        // storageCenter url 링크 주소 가져오기
        cockpit.spawn(["python3", "/usr/share/cockpit/ablestack/python/url/create_address.py", "storageCenter", "-H"])
        .then(function(data){
            var retVal = JSON.parse(data);        
            if(retVal.code == 200){
                // 스토리지센터 연결
                window.open(retVal.val);
            }
        })
        .catch(function(data){
            console.log(":::scc_link_go() Error :::" + data);        
        });
    }else{
        window.open('https://'+mgr_ip+':8443');
    }
}

// 스토리지센터VM 연결 버튼 클릭시 URL 세팅
$('#menu-item-linkto-storage-center-vm').on('click', function(){
    // storageCenterVm url 링크 주소 가져오기
    cockpit.spawn(["python3", "/usr/share/cockpit/ablestack/python/url/create_address.py", "storageCenterVm", "-H" ])
    .then(function(data){
        var retVal = JSON.parse(data);        
        if(retVal.code == 200){ 
            // 스토리지 센터 VM 연결
            window.open(retVal.val);
        }
    })
    .catch(function(data){
        console.log(":::menu-item-linkto-storage-center-vm click Error ::: " + data);        
    });    
});

/**
 * Meathod Name : checkConfigStatus  
 * Date Created : 2021.03.23
 * Writer  : 박다정
 * Description : 클러스터 구성준비 상태 조회
 * Parameter : 없음
 * Return  : 없음
 * History  : 2021.03.23 최초 작성
 */
 function checkConfigStatus(){
    return new Promise((resolve) => {
        cockpit.spawn(['grep', '-c', 'ccvm-mngt', '/etc/hosts'])
        .then(data=>{
            if(data){
                cockpit.spawn(['cat', '/root/.ssh/id_rsa.pub'])
                .then(data=>{
                    sessionStorage.setItem("ccfg_status", "true");
                    saveHostInfo();
                    resolve();
                })
                .catch(err=>{
                    // ssh-key 파일 없음
                    sessionStorage.setItem("ccfg_status", "false"); 
                    resolve();
                })
            }
        })
        .catch(err=>{            
            // hosts 파일 구성 되지않음
            sessionStorage.setItem("ccfg_status", "false"); 
            resolve();
        })
    });
}

/**
 * Meathod Name : checkStorageClusterStatus  
 * Date Created : 2021.03.31
 * Writer  : 최진성
 * Description : 스토리지센터 클러스터 상태 조회
 * Parameter : 없음
 * Return  : 없음
 * History  : 2021.03.31 최초 작성
 */
 function checkStorageClusterStatus(){
    return new Promise((resolve) => {
        //bootstrap.sh을 실행했는지 여부 확인
        ///usr/share/cockpit/bootstrap_run_check 파일 생성여부 확인으로 파악
        cockpit.spawn(["cat", "/usr/share/cockpit/bootstrap_run_check"])
        .then(function(data){
            console.log("bootstrap.sh 파일을 실행한 기록이 존재합니다.  : " + data)
            $("#after-bootstrap-run").html("<a class='pf-c-dropdown__menu-item' href='#' id='menu-item-linkto-storage-center' onclick='scc_link_go()'>스토리지센터 연결</a>");
            $("#before-bootstrap-run").html("");
        })
        .catch(function(data){
            console.log("bootstrap.sh 파일을 실행한 기록이 없습니다.  : " + data);
            $("#after-bootstrap-run").html("");
            $("#before-bootstrap-run").html("<a class='pf-c-dropdown__menu-item' href='#' id='menu-item-bootstrap-run' onclick='bootstrap_run()'>Bootstrap 실행</a>");
        });

        cockpit.spawn(["python3", "/usr/share/cockpit/ablestack/python/scc_status/scc_status_detail.py", "detail" ])
        .then(function(data){
            var retVal = JSON.parse(data);
            var sc_status = "Health Err";
            var inMessHtml = "";
            sessionStorage.setItem("sc_status", retVal.val.cluster_status); //스토리지 클러스터 상태값 세션스토리지에 저장
            sessionStorage.setItem("storage_cluster_maintenance_status", retVal.val.maintenance_status); //스토리지 클러스터 유지보수 상태값 세션스토리지에 저장
            //스토리지 클러스터 유지보수 상태 확인 후 버튼 disabled 여부 세팅
            if(retVal.val.maintenance_status){
                $("#menu-item-set-maintenance-mode").attr('class','pf-c-dropdown__menu-item pf-m-disabled');
                $("#menu-item-unset-maintenance-mode").attr('class','pf-c-dropdown__menu-item');            
            }else{            
                $("#menu-item-set-maintenance-mode").attr('class','pf-c-dropdown__menu-item');
                $("#menu-item-unset-maintenance-mode").attr('class','pf-c-dropdown__menu-item pf-m-disabled');
            }
            //스토리지 클러스터 상태값에 따라 icon 및 색상 변경을 위한 css 설정 값 세팅 
            if(retVal.val.cluster_status == "HEALTH_OK"){
                sc_status = "Health Ok";
                $("#scc-cluster-css").attr('class','pf-c-label pf-m-green');
                $("#scc-cluster-icon").attr('class','fas fa-fw fa-check-circle');
            }else if(retVal.val.cluster_status == "HEALTH_WARN"){
                sc_status = "Health Warn";
                $("#scc-cluster-css").attr('class','pf-c-label pf-m-orange');
                $("#scc-cluster-icon").attr('class','fas fa-fw fa-exclamation-triangle');            
            }else if(retVal.val.cluster_status == "HEALTH_ERR"){
                sc_status = "Health Err";
                $("#scc-cluster-css").attr('class','pf-c-label pf-m-red');
                $("#scc-cluster-icon").attr('class','fas fa-fw fa-exclamation-triangle');            
            }            
            
            //json으로 넘겨 받은 값들 세팅            
            if(retVal.val.cluster_status != "HEALTH_OK"){
                //json key중 'message'이라는 key의 value값 가져옴
                const recurse = (obj, arr=[]) => {
                    Object.entries(obj).forEach(([key, val]) => {
                      if (key === 'message') {
                        arr.push(val);
                      }
                      if (typeof val === 'object') {
                        recurse(val, arr);
                      }
                    });
                    return arr;
                };
                //health상태가 warn, error일경우 message 정보 확인하기 위함.
                var messArr = recurse(retVal);
                for(var i in messArr){
                    inMessHtml = inMessHtml + "<br> - "  + messArr[i];
                }
                //console.log(inHtml);
                $('#scc-status').html(sc_status + inMessHtml);
            }else{
                $('#scc-status').html(sc_status);                
            }
            if(retVal.val.osd !="N/A" && retVal.val.osd_up !="N/A" ){
                $('#scc-osd').text("전체 " + retVal.val.osd + "개의 디스크 중 " + retVal.val.osd_up + "개 작동 중");
            }
            if(retVal.val.mon_gw1 !="N/A" && retVal.val.mon_gw2 !="N/A" ){
                $('#scc-gw').text("RBD GW " + retVal.val.mon_gw1 + "개 제공중(quorum : " + retVal.val.mon_gw2 + ")");
            }
            if(retVal.val.mgr !="N/A" && retVal.val.mgr_cnt !="N/A" ){            
                $('#scc-mgr').text(retVal.val.mgr + "(전체 " + retVal.val.mgr_cnt + "개 실행중)");
            }
            if(retVal.val.pools !="N/A"){
                $('#scc-pools').text(retVal.val.pools + " pools");
            }
            if(retVal.val.avail !="N/A" && retVal.val.used !="N/A" && retVal.val.usage_percentage !="N/A" ){
                $('#scc-usage').text("전체 " + retVal.val.avail + " 중 " +retVal.val.used + " 사용 중 (사용률 " + retVal.val.usage_percentage+ " %)" );
            }
            
            // 스토리지 클러스터 미배포 상태일경우 display세팅
            if(retVal.val.cluster_status == "HEALTH_ERR"){
                $('#scc-status-check').text("스토리지센터 클러스터가 구성되지 않았습니다.");            
                $('#scc-status-check').attr("style","color: var(--pf-global--danger-color--100)");
                $("#menu-item-linkto-storage-center").addClass('pf-m-disabled');
            }else{
                $('#scc-status-check').text("스토리지센터 클러스터가 구성되었습니다.");
                $('#scc-status-check').attr("style","color: var(--pf-global--success-color--100)");
                $("#menu-item-linkto-storage-center").removeClass('class','pf-m-disabled');            
            }
            resolve();
        })
        .catch(function(data){
            console.log(":::checkStorageClusterStatus() Error::: "+ data);
            $('#scc-status-check').text("스토리지센터 클러스터가 구성되지 않았습니다.");
            $('#scc-status-check').attr("style","color: var(--pf-global--danger-color--100)");
            $("#menu-item-set-maintenance-mode").attr('class','pf-c-dropdown__menu-item pf-m-disabled');
            $("#menu-item-unset-maintenance-mode").attr('class','pf-c-dropdown__menu-item pf-m-disabled');
            $("#menu-item-linkto-storage-center").attr('class','pf-c-dropdown__menu-item pf-m-disabled');
            $("#menu-item-bootstrap-run").attr('class','pf-c-dropdown__menu-item pf-m-disabled');
            resolve();
        });
    });
}


/**
 * Meathod Name : checkStorageVmStatus  
 * Date Created : 2021.03.31
 * Writer  : 최진성
 * Description : 스토리지센터 가상머신 상태 조회
 * Parameter : 없음
 * Return  : 없음
 * History  : 2021.03.31 최초 작성
 */
 function checkStorageVmStatus(){
    return new Promise((resolve) => {
        cockpit.spawn(["python3", "/usr/share/cockpit/ablestack/python/scvm_status/scvm_status_detail.py", "detail" ])
        .then(function(data){        
            var retVal = JSON.parse(data);
            sessionStorage.setItem("scvm_status", retVal.val.scvm_status.toUpperCase());//스트리지센터 가상머신 상태값 세션스토리지에 저장
            sessionStorage.setItem("scvm_cpu", retVal.val.vcpu);//스트리지센터 가상머신 상태값 세션스토리지에 저장
            sessionStorage.setItem("scvm_momory", retVal.val.memory);//스트리지센터 가상머신 상태값 세션스토리지에 저장

            //json으로 넘겨 받은 값들 세팅
            var scvm_status = retVal.val.scvm_status;
            if(scvm_status == "running"){
                scvm_status = "Running";
            }else if(scvm_status == "shut off"){
                scvm_status = "Stopped";
            }else{
                scvm_status = "Health Err";
            }
            $('#scvm-status').text(scvm_status);
            if(retVal.val.vcpu !="N/A"){
                $('#scvm-cpu').text(retVal.val.vcpu + " vCore");
            }
            //$('#scvm-cpu').text(retVal.val.vcpu + "vCore(" + retVal.val.socket + " Socket, "+retVal.val.core+" Core)");
            if(retVal.val.memory !="N/A"){
                $('#scvm-memory').text(retVal.val.memory);
            }
            if(retVal.val.rootDiskSize !="N/A" && retVal.val.rootDiskAvail !="N/A" && retVal.val.rootDiskUsePer !="N/A"){
                $('#scvm-rdisk').text(retVal.val.rootDiskSize + "(사용가능 " + retVal.val.rootDiskAvail + " / 사용률 " + retVal.val.rootDiskUsePer + ")");
            }
            if(retVal.val.manageNicType !="N/A" && retVal.val.manageNicParent !="N/A"){
                $('#scvm-manage-nic-type').text("NIC Type : " + retVal.val.manageNicType + " (Parent : " + retVal.val.manageNicParent + ")");
            }
            if(retVal.val.manageNicIp !="N/A"){
                $('#scvm-manage-nic-ip').text("IP : " + retVal.val.manageNicIp);
            }             
            if(retVal.val.manageNicGw !="N/A"){
                $('#scvm-manage-nic-gw').text("GW : " + retVal.val.manageNicGw);
            }
            if(retVal.val.storageServerNicType !="N/A"){
                $('#scvm-storage-server-nic-type').text("서버용 NIC Type : " + retVal.val.storageServerNicType);
                if( retVal.val.storageServerNicParent !="N/A"){
                    $('#scvm-storage-server-nic-type').text("서버용 NIC Type : " + retVal.val.storageServerNicType + " (Parent : " + retVal.val.storageServerNicParent + ")");
                }
            }
            if(retVal.val.storageServerNicIp !="N/A"){
                $('#scvm-storage-server-nic-ip').text("서버용 IP : " + retVal.val.storageServerNicIp);
            }
            if(retVal.val.storageReplicationNicType !="N/A"){
                $('#scvm-storage-replication-nic-type').text("복제용 NIC Type : " + retVal.val.storageReplicationNicType);
                if( retVal.val.storageReplicationNicParent !="N/A"){
                    $('#scvm-storage-replication-nic-type').text("복제용 NIC Type : " + retVal.val.storageReplicationNicType + " (Parent : " + retVal.val.storageReplicationNicParent + ")");
                }
            }
            if(retVal.val.storageReplicationNicIp !="N/A"){
                $('#scvm-storage-replication-nic-ip').text("복제용 IP : " + retVal.val.storageReplicationNicIp);
            }
            if(retVal.val.dataDiskType !="N/A"){
                $('#scvm-storage-datadisk-type').text("Disk Type : " + retVal.val.dataDiskType);
            }
            // 스토리지센터 가상머신 미배포 상태일경우 display세팅
            if(retVal.val.scvm_status == "HEALTH_ERR"){
                $('#scvm-deploy-status-check').text("스토리지센터 가상머신이 배포되지 않았습니다.");            
                $('#scvm-deploy-status-check').attr("style","color: var(--pf-global--danger-color--100)");
                $("#menu-item-linkto-storage-center-vm").attr('class','pf-c-dropdown__menu-item pf-m-disabled');
            }else{        
                $('#scvm-deploy-status-check').text("스토리지센터 가상머신이 배포되었습니다.");
                $('#scvm-deploy-status-check').attr("style","color: var(--pf-global--success-color--100)");
                $("#menu-item-linkto-storage-center-vm").attr('class','pf-c-dropdown__menu-item');            
            }

            //스토리지 센터 가상머신 toggle세팅
            if(retVal.val.scvm_status == "running"){ //가상머신 상태가 running일 경우
                $("#scvm-css").attr('class','pf-c-label pf-m-green');
                $("#scvm-icon").attr('class','fas fa-fw fa-check-circle');    
                $("#menu-item-set-storage-center-vm-start").attr('class','pf-c-dropdown__menu-item pf-m-disabled');
                $("#menu-item-set-storage-center-vm-resource-update").attr('class','pf-c-dropdown__menu-item pf-m-disabled');
                $("#menu-item-linkto-storage-center-vm").attr('class','pf-c-dropdown__menu-item');
                if(sessionStorage.getItem("sc_status") == "HEALTH_ERR"){ //가상머신 상태 running && sc상태 Error 일때
                    $("#menu-item-set-storage-center-vm-delete").attr('class','pf-c-dropdown__menu-item');                    
                }else{ //가상머신 상태 running && sc상태 ok, warn 일때
                    $("#menu-item-set-storage-center-vm-delete").attr('class','pf-c-dropdown__menu-item pf-m-disabled');                   
                }
                if(sessionStorage.getItem("storage_cluster_maintenance_status") == "true"){ //가상머신 상태 running && sc 유지보수모드일때
                    $("#menu-item-set-storage-center-vm-stop").attr('class','pf-c-dropdown__menu-item');                        
                }else{//가상머신 상태 running && sc 유지보수모드 아닐때
                    $("#menu-item-set-storage-center-vm-stop").attr('class','pf-c-dropdown__menu-item pf-m-disabled');                        
                }
            }else{ //가상머신 상태가 running이 아닐 경우
                $("#scvm-css").attr('class','pf-c-label pf-m-red');
                $("#scvm-icon").attr('class','fas fa-fw fa-exclamation-triangle');                
                $("#menu-item-set-storage-center-vm-start").attr('class','pf-c-dropdown__menu-item');
                $("#menu-item-set-storage-center-vm-stop").attr('class','pf-c-dropdown__menu-item pf-m-disabled');
                $("#menu-item-set-storage-center-vm-delete").attr('class','pf-c-dropdown__menu-item');
                $("#menu-item-set-storage-center-vm-resource-update").attr('class','pf-c-dropdown__menu-item');
                $("#menu-item-linkto-storage-center-vm").attr('class','pf-c-dropdown__menu-item pf-m-disabled');
            }
            resolve();
        })
        .catch(function(data){
            console.log(":::checkStorageVmStatus Error:::" + data);
            $("#menu-item-set-storage-center-vm-start").attr('class','pf-c-dropdown__menu-item pf-m-disabled');
            $("#menu-item-set-storage-center-vm-stop").attr('class','pf-c-dropdown__menu-item pf-m-disabled');
            $("#menu-item-set-storage-center-vm-delete").attr('class','pf-c-dropdown__menu-item pf-m-disabled');
            $("#menu-item-set-storage-center-vm-resource-update").attr('class','pf-c-dropdown__menu-item pf-m-disabled');
            $("#menu-item-linkto-storage-center-vm").attr('class','pf-c-dropdown__menu-item pf-m-disabled');
            $('#scvm-deploy-status-check').text("스토리지센터 가상머신이 배포되지 않았습니다.");
            $('#scvm-deploy-status-check').attr("style","color: var(--pf-global--danger-color--100)");
            resolve();
        });
        //스토리지 클러스터 배포 여부 확인 후 스토리지센터 가상머신 삭제 버튼 disabled 여부 세팅
        if(sessionStorage.getItem("sc_status") == "HEALTH_ERR"){
            $("#menu-item-set-storage-center-vm-delete").removeClass('class','pf-m-disabled');
        }else{
            $("#menu-item-set-storage-center-vm-delete").addClass('class','pf-m-disabled');
        }
    });
}


/**
 * Meathod Name : checkDeployStatus  
 * Date Created : 2021.03.30
 * Writer  : 박다정
 * Description : 요약리본 UI 배포상태에 따른 이벤트 처리
 * Parameter : 없음
 * Return  : 없음
 * History  : 2021.03.30 최초 작성
 */
 function checkDeployStatus(){ 
    /*
       가상머신 배포 및 클러스터 구성 상태를 세션 스토리지에서 조회 
       - 클러스터 구성준비 상태 = false, true
       - 스토리지센터 가상머신 상태 = HEALTH_ERR(배포x), RUNNING, SHUT OFF 등 
       - 스토리지센터 클러스터 상태 = HEALTH_ERR(구성x), HEALTH_OK, HEALTH_WARN 등 
       - 클라우드센터 클러스터 상태 = HEALTH_ERR1(구성x), HEALTH_ERR2(리소스 구성x), HEALTH_OK
       - 클라우드센터 가상머신 상태 = HEALTH_ERR(배포x), RUNNING, SHUT OFF 등 
    */
    const step1 = sessionStorage.getItem("ccfg_status"); 
    const step2 = sessionStorage.getItem("scvm_status"); 
    const step3 = sessionStorage.getItem("sc_status");   
    const step4 = sessionStorage.getItem("cc_status"); 
    const step5 = sessionStorage.getItem("ccvm_status");    
    console.log("step1 :: " + step1 + ", step2 :: " + step2 + " , step3 :: " + step3 + ", step4 :: " + step4 + ", step5 :: " + step5);

    // 배포 상태조회 
    if(step1!="true"){
        // 클러스터 구성준비 버튼 show
        $('#button-open-modal-wizard-storage-cluster').show()
        showRibbon('warning','스토리지센터 및 클라우드센터 VM이 배포되지 않았습니다. 클러스터 구성준비를 진행하십시오.')
    }else{
        if(step2=="HEALTH_ERR"||step2==null){
            // 클러스터 구성준비 버튼, 스토리지센터 VM 배포 버튼 show
            $('#button-open-modal-wizard-storage-cluster').show()
            $('#button-open-modal-wizard-storage-vm').show()
            showRibbon('warning','스토리지센터 및 클라우드센터 VM이 배포되지 않았습니다. 스토리지센터 VM 배포를 진행하십시오.')
        }else{
            if(step3=="HEALTH_ERR"||step3==null){
                // 스토리지센터 연결 버튼 show
                $('#button-open-modal-wizard-cloud-vm').show()
                $('#button-link-storage-center-dashboard').show()
                showRibbon('warning','클라우드센터 VM이 배포되지 않았습니다. 스토리지센터에 연결하여 스토리지 클러스터 구성한 후 클라우드센터 VM 배포를 진행하십시오.')
            }else{
                if(step4=="HEALTH_ERR1"||step4=="HEALTH_ERR2"||step4==null){
                    //클라우드센터 VM 배포 버튼, 스토리지센터 연결 버튼 show
                    $('#button-open-modal-wizard-cloud-vm').show()
                    $('#button-link-storage-center-dashboard').show()
                    if(step4=="HEALTH_ERR1"||step4==null){
                        showRibbon('warning','클라우드센터 클러스터가 구성되지 않았습니다. 클라우드센터 클러스터 구성을 진행하십시오.')
                    }else{
                        showRibbon('warning','클라우드센터 클러스터는 구성되었으나 리소스 구성이 되지 않았습니다. 리소스 구성을 진행하십시오.')
                    }
                }else{
                    if(step5=="HEALTH_ERR"||step5==null){
                        //클라우드센터 VM 배포 버튼, 스토리지센터 연결 버튼 show
                        $('#button-open-modal-wizard-cloud-vm').show()
                        $('#button-link-storage-center-dashboard').show()
                        showRibbon('warning','클라우드센터 VM이 배포되지 않았습니다. 클라우드센터 VM 배포를 진행하십시오.')
                    }else{
                        // 스토리지센터 연결 버튼, 클라우드센터 연결 버튼 show
                        $('#button-link-storage-center-dashboard').show()
                        $('#button-link-cloud-center').show()
                        showRibbon('success','ABLESTACK 스토리지센터 및 클라우드센터 VM이 배포되었으며, 가상어플라이언스 상태가 정상입니다.')
                        // 운영 상태조회
                        let msg ="";
                        if(step2!="RUNNING"){
                            msg += '스토리지센터 가상머신이 '+step2+' 상태 입니다.\n'
                            showRibbon('warning', msg);
                        }
                        if(step3!="HEALTH_OK"){
                            msg += '스토리지센터 클러스터가 '+step3+' 상태 입니다.\n'
                            showRibbon('warning', msg);
                        }
                        if(step5!="RUNNING"){
                            msg += '클라우드센터 가상머신이 '+step5+' 상태 입니다.\n'
                            showRibbon('warning', msg);
                        }
                       
                    }
                }
            }
        }
    }
}

/**
 * Meathod Name : showRibbon  
 * Date Created : 2021.03.23
 * Writer  : 박다정
 * Description : 배포 및 운영 상태에 따른 요약리본 알림메세지 및 class 속성 변경
 * Parameter : (String) status, (String) description
 * Return  : 없음
 * History  : 2021.03.23 최초 작성
 */
 function showRibbon(status, description) {
    $('#ribbon').attr('class','pf-c-alert pf-m-'+status)
    if(status =='success'){
        $('.pf-screen-reader').text('Success alert:');
    }
    let alert_text = $('.pf-c-alert__description').text(description);
    alert_text.html(alert_text.html().replace(/\n/g, '<br/>'));
}

/**
 * Meathod Name : saveHostInfo 
 * Date Created : 2021.04.01
 * Writer  : 박다정
 * Description : 호스트 파일 정보와 mgr 정보를 세션스토리지에 저장
 * Parameter : 없음
 * Return  : 없음
 * History  : 2021.04.01 최초 작성
 */
 function saveHostInfo(){ 
    cockpit.spawn(['cat', '/etc/hosts'])
    .then(function(data){
        var line = data.split("\n");
        for(var i=0; i<line.length; i++){
            var word = line[i].split("\t");
            if(word.length>1){
                sessionStorage.setItem(word[1], word[0]); 
            }
        }    
        for(var j=1; j<line.length; j++){
            if(sessionStorage.getItem("scvm"+j)!=null){
                //pending 상태가 지속될 경우 에러처리 필요함
                cockpit.spawn(['ssh', '-o', 'StrictHostKeyChecking=no','scvm'+j,'ceph', 'mgr','stat'])
                .then(data2=>{
                    if(data2.includes('active_name')==true){
                        var retVal = JSON.parse(data2);
                        if(retVal.active_name!=""){
                            var index = retVal.active_name.indexOf(["."]);
                            sessionStorage.setItem("mgr",retVal.active_name.substring(0,index));       
                        }
                    }
                })
                .catch(err=>{
                    console.log("storage center virtual machine"+j+" ssh command err  :"+err);
                })    
            }else
                break;           
        }
    })
    .catch(function(error){
        console.log("Hosts file is not configured :"+error);
    });  
} 

//30초마다 화면 정보 갱신
setInterval(() => {
        // 배포상태 조회(비동기)완료 후 배포상태에 따른 요약리본 UI 설정
        Promise.all([checkConfigStatus(), checkStorageClusterStatus(), 
            checkStorageVmStatus(), CardCloudClusterStatus(), new CloudCenterVirtualMachine().checkCCVM()]).then(function(){
                checkDeployStatus();
            });
}, 30000);