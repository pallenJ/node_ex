import { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

export enum ModalType {
  alert = 'ALERT', confirm = 'CONFIRM'
};

export const MyModal = (props: any) => {
  function getValue <T> (key: string, init: T){
    return props.info ? (props.info[key] as T?? init) : init
  }
  const getFooter = () => {

    switch (getValue('type', ModalType.confirm) as string) {
      case ModalType.alert:
        return <div>
          <Button variant={getValue('theme','primary') as string} onClick={props.onHide}>
            {getValue('okText', 'OK')}
          </Button>
        </div>;;
      default:
        return (<div>
          <Button variant="light" onClick={()=>{ props.onHide();}}>
            {getValue('closeText', 'Close')}
          </Button>
          <Button variant={getValue('theme','primary') as string} onClick = {()=>{getValue('confirmNext',()=>{console.log('OK')})(); props.onHide();}}>
            {getValue('okText', 'OK')}
          </Button>
        </div>);
    }
  }

  return (
    <Modal
      {...props}
    >
      <Modal.Header closeButton>
        <Modal.Title>{getValue('title', 'Modal Title')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          {getValue<any>('content', '')}
        </p>
      </Modal.Body>

      <Modal.Footer>
        {
          getFooter()
        }

      </Modal.Footer>
    </Modal>
  )
}


export default this;