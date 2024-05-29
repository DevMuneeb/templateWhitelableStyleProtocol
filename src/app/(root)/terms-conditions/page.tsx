"use client";
import { navigate } from "@/actions";
import { ChevronLeftIcon } from "lucide-react";

const Page = () => {
  const goToMain = async () => {
    await navigate("/");
  };
  return (
    <div className="w-full py-6">
      <div className="container px-4  md:px-6">
        <div onClick={() => goToMain()}>
          <ChevronLeftIcon className="size-11 cursor-pointer" />
        </div>
        <div className="mx-auto prose max-w-3xl">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
            Terms & Conditions: STYLE Protocol
          </h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Last updated: January, 2024
          </p>

          <div className="mx-auto space-y-4 py-5 prose max-w-[900px]">
            <h2 className="font-bold tracking-tighter text-xl">
              1. Introduction
            </h2>
            <p className="px-7">
              1.1. These terms and conditions <span>(“Terms”)</span> are entered
              into between STYLE Association, a Swiss association pursuant to
              art. 60 et seqq. Swiss Civil Code, domiciled at Dammstrasse 16,
              6300 Zug (“We”, “Us” or “Our”) and you (“You” or “Your”), together
              the parties (“Parties”), each alone a party (“Party”).
            </p>
            <p className="px-7">
              1.2. Please read these Terms carefully as they contain important
              information and affect Your legal rights and obligations. By
              clicking to accept and/or using Our service as defined below under
              section 2, You agree to be bound by these Terms and all of the
              terms incorporated herein by reference. If You do not agree to
              these Terms, You may not access and/or use Our service.
            </p>
            <p className="px-7">
              1.3. We reserve the right to change or modify these Terms at any
              time and in Our sole discretion. If we make material changes to
              these Terms, we will use reasonable efforts to provide notice of
              such changes, such as by providing notice through our website
              [www.protocol.style] or updating the “Last Updated” date at the
              beginning of these Terms. By continuing to access or use the
              service, You confirm Your acceptance of the revised Terms and all
              of the terms incorporated therein by reference effective as of the
              date these Terms are updated. It is Your sole responsibility to
              review the Terms from time to time to view such changes and to
              ensure that You understand and agree to the Terms that apply when
              You access or use the service.
            </p>

            <h2 className="mt-6 font-bold tracking-tighter text-xl">
              2. Scope of the Service
            </h2>
            <p className="px-7">
              2.1. We provide a decentralized network service called $STYLE
              protocol (“Service”). Our aim is to connect all metaverses and
              games (“Environments”, cf. also sect. 5.1 below) in the space and
              to provide true interoperability by making NFTs and virtual assets
              compatible across the multiverse. In order to do so “Owners” (cf.
              also sect. 3.1 below) of any kind of visual intellectual property
              (e.g. a picture file, a given NFT), not necessarily connected to
              any blockchain (“Connected Assets” or „Initial Assets”), can
              instruct “Tailors” (cf. also sect. 4.1 below) to create a 3D file
              suitable for the use in the relevant Environments based on the
              Connected Asset and link it to an NFT (“Derivative Asset”).
              Derivative Assets can be bought and sold by “Users” (cf. also
              sect. 6.1 below) of a specific Environment. Buyers of a Derivative
              Asset are entitled to a license for the use of a Derivative Asset
              in a specific Environment (cf. also sect. 6.2 below).
            </p>
            <p className="px-7">
              2.2. We connect on Our decentralized protocol Owners, Tailors,
              Environments as well as Users. The rights and obligations of the
              Owners, Tailors, Environments and Users are described in the
              following sections 3,4,5 and 6.
            </p>
            <p className="px-7">
              2.3. As per section 2.1 above Our Service is strictly limited to
              the provision of a peer-topeer Service that helps You discover and
              directly interact with Owners, Tailors, Environments and other
              Users respectively. You understand and agree that We only provide
              the Service and the infrastructure on which the Service is built.
              We are in no event party to any agreement entered into between
              Owners, Tailors, Environments or Users and we have no control over
              the conduct of the Owners, Tailors, Environments or Users.
              Therefore, We cannot and do not provide any guarantee and exclude
              any liability beyond the above-mentioned scope of Our Service.
            </p>
            <p className="px-7">
              2.4. We do not have custody or control over the NFTs or
              blockchains You are interacting with and We do not execute or
              effectuate purchases, transfers, payments, or sales of NFTs. To
              use Our Service, You must use a third-party wallet which allows
              You to engage in transactions on blockchains, in accordance with
              the terms and conditions of such third party providers, as
              applicable.
            </p>
            <p className="px-7">
              2.5. We reserve the right at any time to modify or discontinue the
              Service (or any part or content thereof) without notice at any
              time. We shall not be liable to You or to any third-party for any
              modification, suspension or discontinuance of the Service.
            </p>
            <p className="px-7">
              2.6. We reserve the right, but are not obligated, to exclude
              specific persons, geographic regions or jurisdictions from Our
              Service. We may exercise this right at any time and on a
              case-by-case basis.
            </p>

            <h2 className="mt-6 font-bold tracking-tighter text-xl">
              3. Rights and Obligations of Owners of Initial Assets (“Owner/s”)
            </h2>
            <p className="px-7">
              3.1. Definition of Owner: Anyone offering an Asset for
              interoperability with specific Environments onto the STYLE
              Protocol. The Owner decides in which Environments and in which
              quantity his/her Connected Asset shall be made available once it
              has been tailored accordingly by the Tailor. The Owner also
              defines the price of the Derivative Asset and, accordingly, the
              remuneration of the Tailor and the Environment.
            </p>
            <p className="px-7">
              3.2. The Owner represents, warrants and agrees that: - He/she has
              all necessary rights to each Initial Asset that he/she brings onto
              the STYLE Protocol; and - he/she will not offer stolen Assets,
              Assets taken or processed without authorization or otherwise
              illegally obtained Asset on the STYLE Protocol. The Owner shall
              indemnify Us, the Tailor and the Environments for any claims made
              by third parties against the Tailor and the Environments, in
              connection with the rights to a Connected Asset.
            </p>
            <p className="px-7">
              3.3. By offering an Asset onto the STYLE Protocol the Owner
              commits to use the Style Protocol for the creation and marketing
              of the Derivative Asset, respectively, by the Tailor and, if
              requested by the Owner, the sale of the Derivative Asset. If
              Derivative Assets are being sold to Users of the Environments the
              Owner receives a share of the sales proceeds, the amount of which
              varies depending on the price of the Derivative Asset sold and the
              variables initially designed by the Owner. The Owner is solely
              responsible for any taxes which might occur in connection with
              his/her income. In return for the price paid by the User the Owner
              grants the holder of the Derivative Asset i.e. the respective User
              a worldwide, simple, perpetual license to the 3D file (“License”)
              which allows the User to use the Derivative Asset to its fullest
              extent and to sell the Derivative Asset to another User.
            </p>
            <p className="px-7">
              3.4. Whenever a User initially buys a Derivative Asset the
              Derivative Asset is instantly minted in the Environment and
              transferred to the User. In cases where the Derivative Asset is
              minted by the Owner, the Owner agrees and confirms to transfer the
              Derivative Asset and thus, the associated rights of use to the
              User. It is understood and agreed by all involved parties that the
              User holding the Derivative Asset is considered the licensee of
              the License.
            </p>
            <p className="px-7">
              3.5. The Owner accepts the current Terms of the STYLE Protocol.
              The Owner also understands and agrees that the compensation as
              described above in sect.3.3 is provided automatically and
              independently by a smart contract, he/she is not entitled to any
              claims or remunerations against the STYLE Protocol or the STYLE
              Association.
            </p>

            <h2 className="mt-6 font-bold tracking-tighter text-xl">
              4. Rights and Obligations of Owners of Tailors (“Tailor/s”)
            </h2>
            <p className="px-7">
              4.1. Definition of Tailor: Anyone “tailoring” Connected Assets
              into 3D files in order to enable them to be used in a specific or
              several Environment(s) as Derivative Assets. Owners mandate
              Tailors directly and Tailors will tailor according to the Owners’
              instructions only. Any Tailor may also create and upload his/her
              own Connected Asset into the STYLE Protocol and act as Owner.
            </p>
            <p className="px-7">
              4.2. If the Tailor tailors 3D files according to the Owner’s
              instructions the Tailor agrees and confirms that he/she transfers
              all copyrights in relation to the 3D file created to the Owner
              immediately after creation and no copyrights connected with the 3D
              file will remain with the Tailor.
            </p>
            <p className="px-7">
              4.3. The Tailor receives a reward in USDC for work committed, the
              amount of which varies depending on the price of the Derivative
              Asset and the initial variables defined by the Owner. The Tailor
              is solely responsible for any taxes which might occur in
              connection with his/her income.
            </p>
            <p className="px-7">
              4.4. The Tailor agrees to the Terms of the STYLE Protocol in
              force. In addition, the Tailor understands and agrees that, the
              compensation as described above in sect. 4.3 is provided
              automatically and independently by a smart contract, he/she is not
              entitled to any claims or remuneration against the STYLE Protocol
              or the STYLE Association.
            </p>

            <h2 className="mt-6 font-bold tracking-tighter text-xl">
              5. Rights and Obligations of Owners of Connected Metaverses and
              Games (“Environment/s”)
            </h2>
            <p className="px-7">
              5.1. Definition of Environment: Environments are primarily
              metaverses and games that utilize the open protocol and the
              decentralized infrastructure of the STYLE Protocol. The
              Environments are fetching and subsequently displaying the tailored
              3D file in their world for their players and customers to
              discover. Players and customers will be able to buy and use
              Derivative Assets which entitle them to a license for the use of
              the 3D file in the Environment. Any Environment may also create
              and upload its own Connected Asset into the STYLE Protocol and act
              as Owner
            </p>
            <p className="px-7">
              5.2. The Environment agrees and confirms that it has no rights in
              relation to the Connected Asset as well as the 3D files and/or the
              Derivative Assets unless the Environment uploads its own Connected
              Asset and/or tailors the 3D file/Derivative Asset itself.
            </p>
            <p className="px-7">
              5.3. The Environment receives a share of the sales proceeds
              whenever a Derivative Asset is being sold to a User of the
              Environment or whenever the Environment’s own Derivative Asset is
              being sold in another Environment. The amount of these proceeds
              depends on the price of Derivative Asset concerned. Each
              Environment is solely responsible for any taxes which might occur
              in connection with the proceeds described above.
            </p>
            <p className="px-7">
              5.4. The Environment agrees to the Terms of the STYLE Protocol in
              force. In addition, the Environment understands and agrees that,
              apart from the compensation from the smart contract as described
              in para. 5.3 above, it is not entitled to any claims against the
              STYLE Protocol or the STYLE Association.
            </p>

            <h2 className="mt-6 font-bold tracking-tighter text-xl">
              6. Rights and Obligations of Buyers and Sellers of Derivative
              Assets (“Users”)
            </h2>
            <p className="px-7">
              6.1. Definition of Users: Users are the players and customers of
              the different Environments connected with the STYLE Protocol.
              Users can browse the different Derivative Assets displayed in the
              Environments and have the possibility to buy and use Derivative
              Assets.
            </p>
            <p className="px-7">
              6.2. If a User wishes to buy a Derivative Asset he/she must pay
              the respective price (denominated in the relevant Environment’s
              currency) for the minting costs and the Derivative Asset including
              its associated rights of use regarding the 3D file. In doing so
              the User “requests” the minting of the Derivative Asset and its
              transfer to his/her wallet. The holder of the Derivative Asset is
              considered the licensee rights of use for the 3D file. With the
              transfer of the Derivative Asset , the User is granted a License
              which allows the User to use the Derivative Asset to its fullest
              extent.
            </p>
            <p className="px-7">
              6.3. The User is furthermore entitled to transfer the Derivative
              Asset and with it the License. With the transfer of the Derivative
              Asset , the license agreement between the previous User and the
              Owner is terminated. The previous User acknowledges and confirms
              that he/she has no longer any rights to the Derivative Asset
              and/or the respective 3D file after the transfer.
            </p>
            <p className="px-7">
              6.4. The User accepts the current Terms of the STYLE Protocol. The
              User acknowledges and confirms that he/she acquires the Derivative
              Asset and the License from the Owner and has no claims whatsoever
              against the STYLE Protocol or the STYLE Association. The User
              confirms that he/she is solely responsible for determining what,
              if any, taxes apply to his/her transactions on the Platform.
            </p>

            <h2 className="mt-6 font-bold tracking-tighter text-xl">
              7. Risks
            </h2>
            <p className="px-7">
              7.1. Value and Volatility You understand and agree that Your
              access to, and use of, Our Service is subject to certain risks
              including without limitation: <br />
              <br /> (a) The price and liquidity of collectible blockchain
              assets, are extremely volatile and subjective and may be subject
              to fluctuations;
              <br /> (b) Collectible blockchain assets have no inherent or
              intrinsic value; <br /> (c) Fluctuations in the price of other
              digital assets could materially and adversely affect the value of
              Your Derivative Asset, which may also be subject to significant
              price volatility; <br /> (d) Collectible blockchain assets are not
              legal tender and are not backed by any government;
              <br /> (e) Transactions involving collectible blockchain assets
              may be irreversible, and losses due to fraudulent or accidental
              transactions may not be recoverable, including accidental
              transactions whereby you provide wrong wallet addresses;
              <br /> (f) The value of collectibles, is inherently subjective,
              and factors occurring outside the STYLE Protocol may materially
              impact the value and desirability of any particular collectible
              blockchain assets, Connected Asset or Derivative Asset;
              <br /> (g) The value of collectible blockchain assets may be
              derived from the continued willingness of market participants to
              exchange fiat currency or digital assets for such assets, and
              therefore the value of collectible blockchain assets is subject to
              the potential for permanent or total loss of value should the
              market for collectible blockchain assets disappear; and <br /> (h)
              Collectible blockchain assets are subject to the risk of fraud,
              counterfeiting, cyberattacks and other technological difficulties
              which may prevent access to or use of Your Derivative Asset.
            </p>
            <p className="font-bold px-7">7.2. Cryptocurrency Risks</p>
            <p className="px-7">
              There are risks associated with using a cryptocurrency, including,
              but not limited to, the risk of hardware, software and internet
              connections, the risk of malicious software introduction, and the
              risk that third parties may obtain unauthorised access to
              information stored with Your electronic wallet. You acknowledge
              and accept that We will not be responsible for any communication
              failures, disruptions, errors, distortions or delays You may
              experience when using Our Service.
            </p>
            <p className="font-bold px-7">7.3. Regulatory Uncertainty</p>
            <p className="px-7">
              The regulatory regime governing blockchain technologies,
              cryptocurrencies and tokens is uncertain, and new regulations or
              policies may materially adversely affect the development of Our
              Service, and by extension, the use, transfer, value and potential
              utility of Your Derivative Asset.
            </p>
            <p className="font-bold px-7">7.4. Your Own Risk</p>
            <p className="px-7">
              You understand and agree that you are solely responsible for
              determining the nature, potential value, suitability and
              appropriateness of these risks for yourself. We do not give any
              advice or recommendations regarding the Derivative Asset. You
              understand and agree that You access and use Our Service at Your
              own risk. You understand and agree that We will not be responsible
              for any communication failures, disruptions, errors, or
              distortions You may experience when using Our Service.
            </p>

            <h2 className="mt-6 font-bold tracking-tighter text-xl">
              8. Liability
            </h2>
            <p className="px-7">
              We exclude any and all liability for Us and any auxiliary persons
              to the maximum extent permitted by law.
            </p>

            <h2 className="mt-6 font-bold tracking-tighter text-xl">
              9. Miscellaneous
            </h2>
            <p className="px-7">
              9.1. Assignment: We may assign any of Our rights or obligations
              under these Terms without Your consent and without prior notice to
              You. You may not assign or transfer any of Your rights or
              obligations under these Terms, in whole or in part, without Our
              prior written consent, which may be withheld at Our sole
              discretion.
            </p>
            <p className="px-7">
              9.2. Severance: If a provision of these Terms is held to be void,
              invalid, illegal or unenforceable, that provision is to be read
              down as narrowly as necessary to allow it to be valid or
              enforceable, failing which, that provision (or that part of that
              provision) will be severed from these Terms without affecting the
              validity or enforceability of the remainder of that provision or
              the other provisions in these Terms.
            </p>
            <p className="px-7">
              9.3. Disputes: Neither party may commence court proceedings
              relating to any dispute arising from, or in connection with, these
              Terms without first meeting with the other party to seek (in good
              faith) to resolve that dispute (unless that party is seeking
              urgent interlocutory relief).
            </p>
            <p className="px-7">
              9.4. Applicable law and jurisdiction: These Terms shall be
              governed and construed in accordance with material Swiss law. The
              ordinary courts of Zug, Switzerland, shall have exclusive
              jurisdiction.
            </p>

            <div className="mt-6">
              <p className="text-right">
                <span className="font-bold">STYLE Association</span> <br />
                Dammstr. 16, <br />
                6300 Zug, <br />
                CH
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
