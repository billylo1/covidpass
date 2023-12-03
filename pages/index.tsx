import {NextSeo} from 'next-seo';
import {useTranslation} from 'next-i18next';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';

import Form from '../components/Form';
import Card from '../components/Card';
import Page from '../components/Page';
import Alert from '../components/Alert';
import React, { useEffect, useState } from 'react';
import { isIOS, isSafari, isAndroid, osVersion, isMacOs} from 'react-device-detect';
import usePassCount from "../src/hooks/use_pass_count";
import Link from 'next/link';

function Index(): JSX.Element {
    const { t } = useTranslation(['common', 'index', 'errors']);
    const passCount = usePassCount();    
    const displayPassCount = (passCount? `${passCount} receipts have been processed successfully to date!` : '');

    const [warningMessages, _setWarningMessages] = useState<Array<string>>([]);

    const setWarningMessage = (message: string) => {
        if (!message) return;

        const translation = t('errors:'.concat(message));
        _setWarningMessages(Array.from(new Set([...warningMessages, translation !== message ? translation : message])));
    };

    const deleteWarningMessage = (message: string) => _setWarningMessages(warningMessages.filter(item => item !== message));

    useEffect(() => {
        if ((isIOS && !isMacOs) && !isSafari) {
            setWarningMessage("iPhone users, only Safari is supported at the moment. Please switch to Safari to prevent any unexpected errors.");
        } else {
            if (isAndroid) {
                if (Number(osVersion.split('.')[0]) >= 8) {
                    setWarningMessage("Hi Android user! Check out our new Add to Google Pay button!");
                } else {
                    setWarningMessage("Sorry, Add to Google Pay is only available to Android 8.1+");
                }
            } 
        }
    }, []);
    

    const title = 'Grassroots - vaccination QR Code import for Apple and Android devices. Supports all Canadian provinces and territories';
    const description = 'Grassroots imports vaccination QR codes and stores them on Apple and Android devices in a convenient, secure, and privacy-respecting way. Supports SHC QR codes from all Canadian provinces and territories';

    return (
        <>
            <NextSeo
                title={title}
                description={description}
                openGraph={{
                    url: 'https://grassroots.vaccine-ontario.ca/',
                    title: title,
                    description: description,
                    images: [
                        {
                            url: 'https://grassroots.vaccine-ontario.ca/grassroots.jpg',
                            width: 400,
                            height: 400,
                            alt: description,
                        }
                    ],
                    site_name: title,
                }}
                twitter={{
                    handle: '@grassroots_team',
                    site: '@grassroots_team',
                    cardType: 'summary_large_image',
                }}
            />
            <Page content={
                <div className="space-y-5">
                    {warningMessages.map((message, i) =>
                        <Alert message={message} key={'error-' + i} type="warning" onClose={() => deleteWarningMessage(message)} />
                    )}
                    <Card content={
                        <div><p>{t('common:subtitle')}</p><br /><p>{t('common:subtitle2')}</p>
                            <div className="region-section">
                                <div className="region-card">Alberta</div>
                                <div className="region-card">British Columbia</div>
                                <div className="region-card">Manitoba</div>
                                <div className="region-card">New Brunswick</div>
                                <div className="region-card">Newfoundland and Labrador</div>
                                <div className="region-card">Northwest Territories</div>                                
                                <div className="region-card">Nova Scotia</div>
                                <div className="region-card">Nunavut</div>
                                <div className="region-card">Ontario</div>
                                <div className="region-card">Prince Edward Island</div>
                                <div className="region-card">Québec</div>
                                <div className="region-card">Saskatchewan</div>
                                <div className="region-card">Yukon</div>
                                <div className="region-card">Canadian Armed Forces</div>
                            </div>
                            {/* <div className="region-section">
                                <div className="region-card">California</div>
                                <div className="region-card">Connecticut</div>
                                <div className="region-card">Delaware</div>
                                <div className="region-card">Hawaii</div>
                                <div className="region-card">Kentucky</div>
                                <div className="region-card">Louisiana</div>
                                <div className="region-card">Nevada</div>
                                <div className="region-card">New Mexico</div>
                                <div className="region-card">New Jersey</div>
                                <div className="region-card">New York</div>
                                <div className="region-card">Oklahoma</div>
                                <div className="region-card">Utah</div>
                                <div className="region-card">Virginia</div>
                            </div> */}
                            <b>{displayPassCount}</b><br/><br/>
                            Dec 3, 2023 update:
                            <br />
                            <br />
                            Extended support for new vaccines such as XBB 1.5
                            Nov 18, 2022 update:
                            <br />
                            <br />
                            We managed to correct the error (No SHC code found for AB, BC, QC and Canadian Forces users).
                            <br />
                            <br />
                            <p>{t('common:continueSpirit')}</p>
                            <br />  
                            <Link href="https://youtu.be/O9jtIjj9BnY">
                                {/* <a className="underline" target="_blank"> */}
                                <a className="underline">
                                    {t('index:androidDemo')}
                                </a>
                            </Link><br/>
                            <Link href="https://www.youtube.com/watch?v=XAg8IoIdlsU">
                                {/* <a className="underline" target="_blank"> */}
                                <a className="underline">
                                    {t('index:iosDemo')}
                                </a>
                            </Link>
                            </div>
                    }/>
                    <Form/>
                </div>
            }/>
        </>
    )
}


export async function getStaticProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, ['common', 'index', 'errors'])),
        },
    };
}

export default Index;
