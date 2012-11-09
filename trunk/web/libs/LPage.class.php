<?php
class LPage{
	//单页记录数
	private $page_capacity;
	//当前页
	private $current_page;
	//第一页
	private $first_page;
	//总页数
	private $total_page;
	//上一页
	private $pre_page;
	//下一页
	private $next_page;
	//总记录数
	private $total_capacity;
	public function genPage($total_capacity,$current_page=1,$page_capacity=20){
		$this->total_capacity = $total_capacity;
		$this->current_page = $current_page;
		$this->page_capacity = $page_capacity;
		if($current_page>1){
			$this->pre_page = $current_page - 1;
		}else{
			$this->pre_page = 1;
		}
		if(ceil($total_capacity/$page_capacity)>$current_page){
			$this->next_page = $current_page + 1;
			$this->total_page = ceil($total_capacity/$page_capacity);
		}else{
			$this->next_page = $current_page;
			$this->total_page = $current_page;
		}
		$this->first_page = 1;
	}
	public function getPages(){
		$data['pre_page'] = $this->pre_page;
		$data['next_page'] = $this->next_page;
		$data['total_page'] = $this->total_page;
		$data['first_page'] = $this->first_page;
		$data['total_capacity'] = $this->total_capacity;
		$data['current_page'] = $this->current_page;
		$data['page_capacity'] = $this->page_capacity;
		return $data;
	}
}
?>
